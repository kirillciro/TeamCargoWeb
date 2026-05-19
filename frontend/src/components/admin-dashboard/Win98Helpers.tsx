"use client";

import React from "react";

// ── Style constants ───────────────────────────────────────────────────────────

export const W98_RAISED: React.CSSProperties = {
  border: "2px solid",
  borderColor: "#fff #808080 #808080 #fff",
  background: "#c0c0c0",
};

export const W98_SUNKEN: React.CSSProperties = {
  border: "2px solid",
  borderColor: "#808080 #fff #fff #808080",
  background: "#fff",
};

// ── Pixel-style SVG icons ─────────────────────────────────────────────────────

export const W98IcUser = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 16 16"
    style={{ display: "block", flexShrink: 0 }}
  >
    <circle cx="8" cy="5" r="3" fill="currentColor" />
    <path d="M2 15 Q2 10 8 10 Q14 10 14 15" fill="currentColor" />
  </svg>
);

export const W98IcMail = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    style={{ display: "block", flexShrink: 0 }}
  >
    <rect x="1" y="3" width="14" height="10" />
    <polyline points="1,3 8,9 15,3" />
  </svg>
);

export const W98IcGear = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 16 16"
    style={{ display: "block", flexShrink: 0 }}
  >
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M6.5 1 L6 2.8 A5.5 5.5 0 0 0 4.3 3.7 L2.6 3.2 L1 5.5 L2.2 6.7 A5.5 5.5 0 0 0 2.1 8 A5.5 5.5 0 0 0 2.2 9.3 L1 10.5 L2.6 12.8 L4.3 12.3 A5.5 5.5 0 0 0 6 13.2 L6.5 15 L9.5 15 L10 13.2 A5.5 5.5 0 0 0 11.7 12.3 L13.4 12.8 L15 10.5 L13.8 9.3 A5.5 5.5 0 0 0 13.9 8 A5.5 5.5 0 0 0 13.8 6.7 L15 5.5 L13.4 3.2 L11.7 3.7 A5.5 5.5 0 0 0 10 2.8 L9.5 1 Z M8 5.5 A2.5 2.5 0 1 0 8 10.5 A2.5 2.5 0 0 0 8 5.5 Z"
    />
  </svg>
);

export const W98IcWhatsApp = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 16 16"
    style={{ display: "block", flexShrink: 0 }}
    fill="currentColor"
  >
    <path d="M8 1C4.13 1 1 4.13 1 8c0 1.23.32 2.4.88 3.41L1 15l3.69-.86A7 7 0 1 0 8 1zm0 12.6a5.6 5.6 0 0 1-2.86-.78l-.2-.12-2.19.51.53-2.13-.13-.22A5.6 5.6 0 1 1 8 13.6zm3.07-4.2c-.17-.08-1-.49-1.15-.54-.16-.06-.27-.08-.38.08s-.44.54-.54.65c-.1.11-.2.12-.37.04-.17-.08-.72-.26-1.37-.84a5.1 5.1 0 0 1-.95-1.17c-.1-.17-.01-.26.07-.34.08-.08.17-.2.26-.3.09-.1.12-.17.17-.28.06-.11.03-.2-.01-.28-.04-.08-.38-.92-.52-1.26-.14-.33-.28-.28-.38-.29H5.8c-.11 0-.28.04-.43.2-.15.16-.57.56-.57 1.37s.59 1.59.67 1.7c.08.11 1.16 1.77 2.81 2.48.39.17.7.27.94.34.39.13.75.11 1.03.07.31-.05 1-.41 1.14-.8.14-.4.14-.74.1-.8-.04-.07-.15-.11-.31-.19z" />
  </svg>
);

// ── Win98Window ───────────────────────────────────────────────────────────────

export function Win98Window({
  title,
  icon,
  secondary,
  children,
}: {
  title: string;
  icon?: React.ReactNode;
  secondary?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div style={{ ...W98_RAISED, marginBottom: 0 }}>
      <div
        style={{
          background: secondary
            ? "linear-gradient(to right, #808080, #a0a0a0)"
            : "linear-gradient(to right, #000080, #1084d0)",
          color: "#fff",
          padding: "3px 6px",
          fontSize: 11,
          fontWeight: "bold",
          display: "flex",
          alignItems: "center",
          gap: 5,
          userSelect: "none",
        }}
      >
        {icon && (
          <span style={{ display: "flex", alignItems: "center" }}>{icon}</span>
        )}
        {title}
      </div>
      <div style={{ padding: "8px 10px" }}>{children}</div>
    </div>
  );
}

// ── Win98Progress ─────────────────────────────────────────────────────────────

export function Win98Progress({
  value,
  color = "#000080",
}: {
  value: number;
  color?: string;
}) {
  return (
    <div>
      <div
        style={{
          ...W98_SUNKEN,
          height: 16,
          padding: 1,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${value}%`,
            height: "100%",
            background: color,
            transition: "width 0.5s",
            display: "flex",
            alignItems: "center",
            paddingLeft: 4,
          }}
        >
          {value > 10 && (
            <span
              style={{ color: "#fff", fontSize: 10, fontFamily: "monospace" }}
            >
              {value}%
            </span>
          )}
        </div>
      </div>
      {value <= 10 && (
        <span style={{ fontSize: 10, fontFamily: "monospace" }}>{value}%</span>
      )}
    </div>
  );
}

// ── Win98Table ────────────────────────────────────────────────────────────────

export function Win98Table({
  rows,
  headers,
}: {
  rows: string[][];
  headers: string[];
}) {
  return (
    <table
      style={{
        width: "100%",
        borderCollapse: "collapse" as const,
        fontSize: 12,
      }}
    >
      <thead>
        <tr style={{ background: "#000080", color: "#fff" }}>
          {headers.map((h) => (
            <th
              key={h}
              style={{
                padding: "2px 6px",
                textAlign: "left" as const,
                fontWeight: "bold",
              }}
            >
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i} style={{ background: i % 2 === 0 ? "#fff" : "#f0f0f0" }}>
            {row.map((cell, j) => (
              <td
                key={j}
                style={{
                  padding: "2px 6px",
                  borderBottom: "1px solid #d0d0d0",
                  fontFamily: j === row.length - 1 ? "monospace" : "inherit",
                  textAlign:
                    j === row.length - 1
                      ? ("right" as const)
                      : ("left" as const),
                  maxWidth: j === 0 ? 160 : undefined,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap" as const,
                }}
              >
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
