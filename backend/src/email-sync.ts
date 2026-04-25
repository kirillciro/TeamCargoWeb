import { ImapFlow } from "imapflow";
import { simpleParser, type ParsedMail } from "mailparser";
import { pool } from "./db.js";

// Gmail IMAP folder → DB folder name mapping
const FOLDERS: { imap: string; db: string }[] = [
  { imap: "INBOX", db: "INBOX" },
  { imap: "[Gmail]/Spam", db: "SPAM" },
  { imap: "[Gmail]/Trash", db: "TRASH" },
];

async function syncFolder(
  client: ImapFlow,
  imapFolder: string,
  dbFolder: string,
): Promise<number> {
  let lock;
  try {
    lock = await client.getMailboxLock(imapFolder);
  } catch {
    return 0; // folder doesn't exist on this account — skip
  }

  let newCount = 0;
  try {
    const since = new Date();
    since.setDate(since.getDate() - 90);

    const rawUids = await client.search({ since }, { uid: true });
    const uids: number[] = rawUids === false ? [] : rawUids;
    if (!uids.length) return 0;

    for await (const msg of client.fetch(
      uids,
      { source: true },
      { uid: true },
    )) {
      if (!msg.source) continue;

      const parsed = (await simpleParser(msg.source)) as ParsedMail;
      const messageId = parsed.messageId;
      if (!messageId) continue;

      // Prefix with folder so the same Message-ID can appear in multiple folders
      const uniqueKey = `${dbFolder}::${messageId}`;

      const exists = await pool.query(
        `SELECT 1 FROM emails WHERE message_id = $1
         UNION ALL
         SELECT 1 FROM email_deletions WHERE message_id = $1
         LIMIT 1`,
        [uniqueKey],
      );
      if (exists.rowCount) continue;

      const emailResult = await pool.query(
        `INSERT INTO emails
           (message_id, from_address, from_name, subject,
            received_at, body_text, body_html, folder, is_read)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING id`,
        [
          uniqueKey,
          parsed.from?.value[0]?.address ?? "unknown",
          parsed.from?.value[0]?.name ?? "",
          parsed.subject ?? "(no subject)",
          parsed.date ?? new Date(),
          parsed.text ?? "",
          typeof parsed.html === "string" ? parsed.html : null,
          dbFolder,
          false,
        ],
      );
      const emailId = emailResult.rows[0].id as number;

      // Store all PDF attachments as binary
      const pdfs = (parsed.attachments ?? []).filter(
        (a: { contentType: string; filename?: string }) =>
          a.contentType === "application/pdf" ||
          (a.filename ?? "").toLowerCase().endsWith(".pdf"),
      );
      for (const att of pdfs) {
        await pool.query(
          `INSERT INTO email_attachments (email_id, filename, content_type, file_data, size_bytes)
           VALUES ($1,$2,$3,$4,$5)`,
          [
            emailId,
            att.filename ?? "document.pdf",
            att.contentType ?? "application/pdf",
            att.content,
            att.size ?? att.content.length,
          ],
        );
      }

      newCount++;
    }
  } finally {
    lock.release();
  }

  return newCount;
}

export async function syncAllFolders(): Promise<{
  newEmails: number;
  error?: string;
}> {
  const client = new ImapFlow({
    host: "imap.gmail.com",
    port: 993,
    secure: true,
    auth: {
      user: process.env.INBOX_GMAIL_USER!,
      pass: process.env.INBOX_GMAIL_APP_PASSWORD!,
    },
    logger: false,
  });

  try {
    await client.connect();
    let total = 0;
    for (const folder of FOLDERS) {
      total += await syncFolder(client, folder.imap, folder.db);
    }
    await client.logout();
    return { newEmails: total };
  } catch (err) {
    try {
      await client.logout();
    } catch {
      /* ignore */
    }
    return {
      newEmails: 0,
      error: err instanceof Error ? err.message : "IMAP sync failed",
    };
  }
}

// ── IMAP deletion ─────────────────────────────────────────────────────────────
// dbFolder→imap folder map (reverse of FOLDERS)
const DB_TO_IMAP: Record<string, string> = {
  INBOX: "INBOX",
  SPAM: "[Gmail]/Spam",
  TRASH: "[Gmail]/Trash",
};

/**
 * Delete emails from Gmail via IMAP.
 * - INBOX / SPAM → move to [Gmail]/Trash
 * - TRASH → permanently delete (expunge)
 * Accepts either specific message_ids (with FOLDER:: prefix) or
 * { all: true, folder: "INBOX"|"SPAM"|"TRASH" } to wipe a whole folder.
 */
export async function imapDeleteEmails(
  target: { all: true; folder: string } | { all: false; messageIds: string[] },
): Promise<void> {
  const client = new ImapFlow({
    host: "imap.gmail.com",
    port: 993,
    secure: true,
    auth: {
      user: process.env.INBOX_GMAIL_USER!,
      pass: process.env.INBOX_GMAIL_APP_PASSWORD!,
    },
    logger: false,
  });

  await client.connect();
  try {
    if (target.all) {
      const imapFolder = DB_TO_IMAP[target.folder];
      if (!imapFolder) return;
      const lock = await client.getMailboxLock(imapFolder);
      try {
        const uids = await client.search({ all: true }, { uid: true });
        if (!uids || (Array.isArray(uids) && uids.length === 0)) return;
        if (target.folder === "TRASH") {
          // Permanently delete
          await client.messageFlagsAdd(uids, ["\\Deleted"], { uid: true });
          await client.mailboxClose();
          await client.mailboxOpen(imapFolder);
          await client.search({ deleted: true }, { uid: true });
          // expunge happens on close
        } else {
          // Move to Gmail Trash
          await client.messageMove(uids, "[Gmail]/Trash", { uid: true });
        }
      } finally {
        lock.release();
      }
    } else {
      // Group by folder (strip FOLDER:: prefix per message_id)
      const byFolder = new Map<string, string[]>();
      for (const dbMsgId of target.messageIds) {
        const sep = dbMsgId.indexOf("::");
        const dbFolder = sep >= 0 ? dbMsgId.slice(0, sep) : "INBOX";
        const realMsgId = sep >= 0 ? dbMsgId.slice(sep + 2) : dbMsgId;
        const imapFolder = DB_TO_IMAP[dbFolder] ?? "INBOX";
        if (!byFolder.has(imapFolder)) byFolder.set(imapFolder, []);
        byFolder.get(imapFolder)!.push(realMsgId);
      }

      for (const [imapFolder, msgIds] of byFolder) {
        let lock;
        try {
          lock = await client.getMailboxLock(imapFolder);
        } catch {
          continue; // folder not accessible
        }
        try {
          for (const msgId of msgIds) {
            const rawUids = await client.search(
              { header: { "message-id": msgId } },
              { uid: true },
            );
            const uids = rawUids === false ? [] : rawUids;
            if (!uids.length) continue;
            if (imapFolder === "[Gmail]/Trash") {
              // Permanently delete
              await client.messageFlagsAdd(uids, ["\\Deleted"], { uid: true });
            } else {
              // Move to Gmail Trash
              await client.messageMove(uids, "[Gmail]/Trash", { uid: true });
            }
          }
        } finally {
          lock.release();
        }
      }
    }
  } finally {
    try {
      await client.logout();
    } catch {
      /* ignore */
    }
  }
}

// backward-compat alias
export const syncInbox = syncAllFolders;
