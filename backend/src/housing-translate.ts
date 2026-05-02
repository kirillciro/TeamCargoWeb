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

/** Text fields stored per-language. Images are non-translatable. */
export type HousingTexts = {
  label?: string;
  title?: string;
  description?: string;
  perk0?: string;
  perk1?: string;
  perk2?: string;
  perk3?: string;
  cta?: string;
  // Non-translatable overrides (same value across all languages)
  perk0Icon?: string;
  perk1Icon?: string;
  perk2Icon?: string;
  perk3Icon?: string;
  img1?: string;
  img2?: string;
  bg?: string;
};

export type HousingTranslations = Record<string, HousingTexts>;

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

const TRANSLATABLE_KEYS: (keyof HousingTexts)[] = [
  "label",
  "title",
  "description",
  "perk0",
  "perk1",
  "perk2",
  "perk3",
  "cta",
];

const NON_TRANSLATABLE_KEYS: (keyof HousingTexts)[] = [
  "perk0Icon",
  "perk1Icon",
  "perk2Icon",
  "perk3Icon",
  "img1",
  "img2",
  "bg",
];

export async function translateHousingTexts(
  source: HousingTexts,
): Promise<HousingTranslations> {
  const toTranslate = Object.fromEntries(
    TRANSLATABLE_KEYS.filter(
      (k) => source[k] && (source[k] as string).trim(),
    ).map((k) => [k, source[k]]),
  ) as Record<string, string>;

  if (Object.keys(toTranslate).length === 0) {
    // Nothing to translate (only non-translatable fields changed) — mark as done
    const done: HousingTranslations = {};
    for (const lang of LANGS) done[lang] = {};
    return done;
  }

  const prompt = `You are a professional website translator. Detect the source language of the texts below and translate each field to every target language listed.

Rules:
- Keep the same tone: professional, concise, clear
- Preserve formatting, punctuation, and capitalization style
- Do NOT translate proper nouns, brand names, or city names (e.g. Amsterdam, Netherlands)
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
        `[housing-translate] retry ${attempt}/${MAX_ATTEMPTS - 1} after ${delay}ms…`,
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
      ) as HousingTranslations;

      // Merge non-translatable overrides into every language
      const nonTranslatable: Partial<HousingTexts> = {};
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
        `[housing-translate] attempt ${attempt + 1} failed:`,
        err instanceof Error ? err.message : err,
      );
    }
  }
  throw lastErr;
}
