import { createRequire } from "module";
const _require = createRequire(import.meta.url);
const pdfParse = _require("pdf-parse") as (
  buf: Buffer,
) => Promise<{ text: string }>;
import OpenAI from "openai";

// Lazy singleton — only created when first extraction is requested
let _openai: OpenAI | null = null;
function getOpenAI(): OpenAI {
  if (!_openai) {
    _openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return _openai;
}

export type CargoData = {
  // Route / dispatch fields
  route?: string | null;
  chauffeurs?: number | null;
  date_from?: string | null;
  date_to?: string | null;
  stops_total?: number | null;

  // Traditional cargo / shipment fields
  shipper_name?: string | null;
  shipper_address?: string | null;
  consignee_name?: string | null;
  consignee_address?: string | null;
  origin?: string | null;
  destination?: string | null;
  transport_mode?: string | null;
  booking_reference?: string | null;
  eta?: string | null;
  etd?: string | null;
  incoterms?: string | null;
  cargo_description?: string | null;
  pieces?: number | null;
  weight_kg?: number | null;
  volume_cbm?: number | null;
  dimensions?: string | null;
  hs_code?: string | null;
  special_instructions?: string | null;
};

const SYSTEM_PROMPT = `You are a logistics document analyzer.
Extract ALL relevant data from the document — it may be a route sheet, dispatch report, booking, waybill, manifest, or packing list.
Return ONLY a valid JSON object matching this exact schema. Use null for any field not found in the document.
{
  "route": null,
  "chauffeurs": null,
  "date_from": null,
  "date_to": null,
  "stops_total": null,
  "shipper_name": null,
  "shipper_address": null,
  "consignee_name": null,
  "consignee_address": null,
  "origin": null,
  "destination": null,
  "transport_mode": null,
  "booking_reference": null,
  "eta": null,
  "etd": null,
  "incoterms": null,
  "cargo_description": null,
  "pieces": null,
  "weight_kg": null,
  "volume_cbm": null,
  "dimensions": null,
  "hs_code": null,
  "special_instructions": null
}`;

export async function extractFromPdfBuffer(
  pdfBuffer: Buffer,
): Promise<{ data: CargoData; rawText: string }> {
  const pdfData = await pdfParse(pdfBuffer);
  const rawText = pdfData.text.trim();

  const response = await getOpenAI().chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: `Document:\n\n${rawText.slice(0, 10000)}` },
    ],
    response_format: { type: "json_object" },
    temperature: 0,
    max_tokens: 1000,
  });

  const data = JSON.parse(
    response.choices[0].message.content ?? "{}",
  ) as CargoData;
  return { data, rawText };
}
