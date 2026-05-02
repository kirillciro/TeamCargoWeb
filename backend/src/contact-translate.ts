import OpenAI from "openai";

let _openai: OpenAI | null = null;
function getOpenAI(): OpenAI {
  if (!_openai)
    _openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      maxRetries: 5,
      timeout: 120_000,
    });
  return _openai;
}

/** Text fields stored per-language. Image is non-translatable. */
export type ContactTexts = {
  title?: string;
  subtitle?: string;
  phone?: string;
  email?: string;
  address?: string;
  send?: string;
  success?: string;
  success_subtitle?: string;
  // Non-translatable
  img?: string;
  whatsapp_number?: string;
  email_address?: string;
  map_address?: string;
  map_pin?: string;
  phoneIcon?: string;
  emailIcon?: string;
  addressIcon?: string;
};

export type ContactTranslations = Record<string, ContactTexts>;

const LANGS = [
  "nl",
  "en",
  "de",
  "fr",
  "it",
  "es",
  "pt",
  "pl",
  "ro",
  "et",
  "lv",
  "fi",
  "sv",
  "da",
  "no",
  "cs",
  "hu",
  "el",
];

const TRANSLATABLE_KEYS: (keyof ContactTexts)[] = [
  "title",
  "subtitle",
  "phone",
  "email",
  "address",
  "send",
  "success",
  "success_subtitle",
];

const NON_TRANSLATABLE_KEYS: (keyof ContactTexts)[] = [
  "img",
  "whatsapp_number",
  "email_address",
  "map_address",
  "map_pin",
  "phoneIcon",
  "emailIcon",
  "addressIcon",
];

export async function translateContactTexts(
  source: ContactTexts,
): Promise<ContactTranslations> {
  const toTranslate = Object.fromEntries(
    TRANSLATABLE_KEYS.filter(
      (k) => source[k] && (source[k] as string).trim(),
    ).map((k) => [k, source[k]]),
  ) as Record<string, string>;

  if (Object.keys(toTranslate).length === 0) {
    const done: ContactTranslations = {};
    for (const lang of LANGS) done[lang] = {};
    return done;
  }

  const prompt = `You are a professional website translator. Detect the source language of the texts below and translate each field to every target language listed.

Rules:
- Keep the same tone: professional, concise, clear
- Preserve formatting, punctuation, and capitalization style
- Do NOT translate proper nouns, brand names, or city names (e.g. Amsterdam, Netherlands, Team Cargo)
- Return ONLY a valid JSON object where top-level keys are language codes and values are objects with the same field keys as the input

Target language codes: ${LANGS.join(", ")}

Input texts:
${JSON.stringify(toTranslate, null, 2)}`;

  const MAX_ATTEMPTS = 5;
  let lastErr: unknown;
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    if (attempt > 0) {
      const delay = Math.min(5000 * Math.pow(2, attempt - 1), 40_000);
      console.log(
        `[contact-translate] retry ${attempt}/${MAX_ATTEMPTS - 1} after ${delay}ms…`,
      );
      await new Promise((r) => setTimeout(r, delay));
    }
    try {
      const response = await getOpenAI().chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        temperature: 0.1,
        max_tokens: 8000,
      });

      const translated = JSON.parse(
        response.choices[0].message.content ?? "{}",
      ) as ContactTranslations;

      // Merge non-translatable overrides into every language
      const nonTranslatable: Partial<ContactTexts> = {};
      NON_TRANSLATABLE_KEYS.forEach((k) => {
        if (source[k]) nonTranslatable[k] = source[k];
      });

      for (const lang of LANGS) {
        if (translated[lang]) {
          translated[lang] = { ...translated[lang], ...nonTranslatable };
        }
      }

      return translated;
    } catch (err) {
      lastErr = err;
      console.warn(
        `[contact-translate] attempt ${attempt + 1} failed:`,
        err instanceof Error ? err.message : err,
      );
    }
  }
  throw lastErr;
}
