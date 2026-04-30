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

export type HeroTexts = {
  slogan?: string;
  badge?: string;
  trustLine?: string;
  stat1Label?: string;
  stat2Label?: string;
  stat3Label?: string;
  stat4Label?: string;
  // numeric/display values — stored but NOT translated
  stat1Value?: string;
  stat2Value?: string;
  stat3Value?: string;
  stat4Value?: string;
};

export type HeroTranslations = Record<string, HeroTexts>;

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

// Only these fields are translatable text — stat values (numbers) are kept as-is
const TRANSLATABLE_KEYS: (keyof HeroTexts)[] = [
  "slogan",
  "badge",
  "trustLine",
  "stat1Label",
  "stat2Label",
  "stat3Label",
  "stat4Label",
];

export async function translateHeroTexts(
  source: HeroTexts,
): Promise<HeroTranslations> {
  // Extract only non-empty translatable fields
  const toTranslate = Object.fromEntries(
    TRANSLATABLE_KEYS.filter(
      (k) => source[k] && (source[k] as string).trim(),
    ).map((k) => [k, source[k]]),
  ) as Record<string, string>;

  if (Object.keys(toTranslate).length === 0) {
    // Nothing to translate (only non-translatable fields changed) — mark as done
    const done: HeroTranslations = {};
    for (const lang of LANGS) done[lang] = {};
    return done;
  }

  const prompt = `You are a professional website translator. Detect the source language of the texts below and translate each field to every target language listed.

Rules:
- Keep the same tone: professional, concise, energetic
- Preserve formatting: dashes (—), dots (·), capitalization style, punctuation
- Do NOT translate proper nouns, brand names, city/country names (e.g. "Amsterdam", "Netherlands", "Team Cargo")
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
        `[hero-translate] retry ${attempt}/${MAX_ATTEMPTS - 1} after ${delay}ms…`,
      );
      await new Promise((r) => setTimeout(r, delay));
    }
    try {
      const response = await getOpenAI().chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        temperature: 0.1,
        max_tokens: 6000,
      });

      const translated = JSON.parse(
        response.choices[0].message.content ?? "{}",
      ) as HeroTranslations;

      // Merge stat values (non-translatable) into every language translation
      const nonTranslatable: Partial<HeroTexts> = {};
      (
        ["stat1Value", "stat2Value", "stat3Value", "stat4Value"] as const
      ).forEach((k) => {
        if (source[k]) nonTranslatable[k] = source[k];
      });

      for (const lang of LANGS) {
        if (!translated[lang]) translated[lang] = {};
        Object.assign(translated[lang], nonTranslatable);
      }

      return translated;
    } catch (err) {
      lastErr = err;
      console.warn(
        `[hero-translate] attempt ${attempt + 1} failed:`,
        err instanceof Error ? err.message : err,
      );
    }
  }
  throw lastErr;
}
