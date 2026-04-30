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

/** Flat text fields stored per-language. Images are non-translatable. */
export type ServicesTexts = {
  title?: string;
  label?: string;
  item0Title?: string;
  item0Desc?: string;
  item1Title?: string;
  item1Desc?: string;
  item2Title?: string;
  item2Desc?: string;
  item3Title?: string;
  item3Desc?: string;
  item4Title?: string;
  item4Desc?: string;
  item5Title?: string;
  item5Desc?: string;
  // Non-translatable image overrides
  img0?: string;
  img1?: string;
  img2?: string;
  img3?: string;
  img4?: string;
  img5?: string;
};

export type ServicesTranslations = Record<string, ServicesTexts>;

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

const TRANSLATABLE_KEYS: (keyof ServicesTexts)[] = [
  "title",
  "label",
  "item0Title",
  "item0Desc",
  "item1Title",
  "item1Desc",
  "item2Title",
  "item2Desc",
  "item3Title",
  "item3Desc",
  "item4Title",
  "item4Desc",
  "item5Title",
  "item5Desc",
];

const IMAGE_KEYS: (keyof ServicesTexts)[] = [
  "img0",
  "img1",
  "img2",
  "img3",
  "img4",
  "img5",
];

export async function translateServicesTexts(
  source: ServicesTexts,
): Promise<ServicesTranslations> {
  const toTranslate = Object.fromEntries(
    TRANSLATABLE_KEYS.filter(
      (k) => source[k] && (source[k] as string).trim(),
    ).map((k) => [k, source[k]]),
  ) as Record<string, string>;

  if (Object.keys(toTranslate).length === 0) {
    // Nothing to translate (only non-translatable fields changed) — mark as done
    const done: ServicesTranslations = {};
    for (const lang of LANGS) done[lang] = {};
    return done;
  }

  const prompt = `You are a professional website translator. Detect the source language of the texts below and translate each field to every target language listed.

Rules:
- Keep the same tone: professional, concise, clear
- Preserve formatting, punctuation, and capitalization style
- Do NOT translate proper nouns or brand names
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
        `[services-translate] retry ${attempt}/${MAX_ATTEMPTS - 1} after ${delay}ms…`,
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
      ) as ServicesTranslations;

      // Merge non-translatable image overrides into every language
      const imageOverrides: Partial<ServicesTexts> = {};
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
        `[services-translate] attempt ${attempt + 1} failed:`,
        err instanceof Error ? err.message : err,
      );
    }
  }
  throw lastErr;
}
