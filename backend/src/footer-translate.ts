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

export type FooterTexts = {
  tagline_sub?: string;
  // Non-translatable contact info
  address_line1?: string;
  address_line2?: string;
  phone?: string;
  email?: string;
};

export type FooterTranslations = Record<string, FooterTexts>;

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

const TRANSLATABLE_KEYS: (keyof FooterTexts)[] = ["tagline_sub"];

const NON_TRANSLATABLE_KEYS: (keyof FooterTexts)[] = [
  "address_line1",
  "address_line2",
  "phone",
  "email",
];

export async function translateFooterTexts(
  source: FooterTexts,
): Promise<FooterTranslations> {
  const toTranslate = Object.fromEntries(
    TRANSLATABLE_KEYS.filter(
      (k) => source[k] && (source[k] as string).trim(),
    ).map((k) => [k, source[k]]),
  ) as Record<string, string>;

  if (Object.keys(toTranslate).length === 0) {
    const done: FooterTranslations = {};
    for (const lang of LANGS) done[lang] = {};
    return done;
  }

  const prompt = `You are a professional translator. Translate the following JSON values into all listed languages. Return ONLY valid JSON with language codes as keys. Do not translate the keys, only the values.

Languages: ${LANGS.join(", ")}

Source (Dutch):
${JSON.stringify(toTranslate, null, 2)}

Return format:
{
  "nl": { ...translated values... },
  "en": { ...translated values... },
  ...
}`;

  for (let attempt = 1; attempt <= 5; attempt++) {
    try {
      const completion = await getOpenAI().chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        temperature: 0.1,
      });
      const raw = completion.choices[0]?.message?.content ?? "{}";
      const parsed = JSON.parse(raw) as Record<string, Record<string, string>>;
      const result: FooterTranslations = {};
      for (const lang of LANGS) {
        result[lang] = parsed[lang] ?? {};
      }
      return result;
    } catch (err) {
      if (attempt === 5) throw err;
      await new Promise((r) => setTimeout(r, attempt * 1000));
    }
  }
  throw new Error("Translation failed after 5 attempts");
}
