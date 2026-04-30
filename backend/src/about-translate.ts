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
export type AboutTexts = {
  label?: string;
  title?: string;
  description?: string;
  description2?: string;
  valuesTitle?: string;
  value0?: string;
  value1?: string;
  value2?: string;
  value3?: string;
  driversPlaced?: string;
  yearsActive?: string;
  location?: string;
  // Non-translatable overrides (same value across all languages)
  yearsActiveNum?: string;
  driversIcon?: string;
  locationIcon?: string;
  imgLeft?: string;
  imgTopRight?: string;
  imgBottomRight?: string;
};

export type AboutTranslations = Record<string, AboutTexts>;

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

const TRANSLATABLE_KEYS: (keyof AboutTexts)[] = [
  "label",
  "title",
  "description",
  "description2",
  "valuesTitle",
  "value0",
  "value1",
  "value2",
  "value3",
  "driversPlaced",
  "yearsActive",
  "location",
];

// These fields are language-neutral — merged into every translation as-is
const IMAGE_KEYS: (keyof AboutTexts)[] = [
  "yearsActiveNum",
  "driversIcon",
  "locationIcon",
  "imgLeft",
  "imgTopRight",
  "imgBottomRight",
];

export async function translateAboutTexts(
  source: AboutTexts,
): Promise<AboutTranslations> {
  const toTranslate = Object.fromEntries(
    TRANSLATABLE_KEYS.filter(
      (k) => source[k] && (source[k] as string).trim(),
    ).map((k) => [k, source[k]]),
  ) as Record<string, string>;

  if (Object.keys(toTranslate).length === 0) {
    // Nothing to translate (only non-translatable fields changed) — mark as done
    const done: AboutTranslations = {};
    for (const lang of LANGS) done[lang] = {};
    return done;
  }

  const prompt = `You are a professional website translator. Detect the source language of the texts below and translate each field to every target language listed.

Rules:
- Keep the same tone: professional, concise, clear
- Preserve formatting, punctuation, and capitalization style
- Do NOT translate proper nouns, brand names, or city names (e.g. Amsterdam)
- Return ONLY a valid JSON object where top-level keys are language codes and values are objects with the same field keys as the input

Target language codes: ${LANGS.join(", ")}

Input texts:
${JSON.stringify(toTranslate, null, 2)}`;

  // Manual retry loop — SDK maxRetries only covers HTTP errors, not TCP ECONNRESET
  const MAX_ATTEMPTS = 5;
  let lastErr: unknown;
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    if (attempt > 0) {
      const delay = Math.min(5000 * Math.pow(2, attempt - 1), 40_000);
      console.log(
        `[about-translate] retry ${attempt}/${MAX_ATTEMPTS - 1} after ${delay}ms…`,
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
      ) as AboutTranslations;

      // Merge non-translatable image overrides into every language
      const imageOverrides: Partial<AboutTexts> = {};
      IMAGE_KEYS.forEach((k) => {
        if (source[k]) imageOverrides[k] = source[k];
      });

      for (const lang of LANGS) {
        if (translated[lang]) {
          translated[lang] = { ...translated[lang], ...imageOverrides };
        }
      }

      return translated;
    } catch (err) {
      lastErr = err;
      console.warn(
        `[about-translate] attempt ${attempt + 1} failed:`,
        err instanceof Error ? err.message : err,
      );
    }
  }
  throw lastErr;
}
