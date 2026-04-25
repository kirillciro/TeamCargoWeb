import twilio from "twilio";
import type { CargoData } from "./ai-extract.js";

export function formatCargoMessage(cargo: CargoData, subject: string): string {
  const line = (label: string, val: string | number | null | undefined) =>
    val != null && val !== "" ? `*${label}:* ${val}` : null;

  const parts: (string | null)[] = [
    `📦 *New Cargo Request*`,
    `_${subject}_`,
    ``,
    // Route / dispatch fields
    line("Route", cargo.route),
    line("Chauffeurs", cargo.chauffeurs),
    cargo.date_from || cargo.date_to
      ? `*Period:* ${cargo.date_from ?? "?"} – ${cargo.date_to ?? "?"}`
      : null,
    line("Stops Total", cargo.stops_total),
    ``,
    // Shipper / consignee
    line("Shipper", cargo.shipper_name),
    cargo.shipper_address ? `  📍 ${cargo.shipper_address}` : null,
    line("Consignee", cargo.consignee_name),
    cargo.consignee_address ? `  📍 ${cargo.consignee_address}` : null,
    ``,
    // Route (origin → destination)
    cargo.origin && cargo.destination
      ? `*Route:* ${cargo.origin} → ${cargo.destination}`
      : (line("Origin", cargo.origin) ??
        line("Destination", cargo.destination)),
    line("Mode", cargo.transport_mode),
    ``,
    // Cargo
    line("Cargo", cargo.cargo_description),
    line("Pieces", cargo.pieces),
    cargo.weight_kg != null ? line("Weight", `${cargo.weight_kg} kg`) : null,
    cargo.volume_cbm != null ? line("Volume", `${cargo.volume_cbm} CBM`) : null,
    line("Dimensions", cargo.dimensions),
    line("HS Code", cargo.hs_code),
    ``,
    line("Ref", cargo.booking_reference),
    line("Incoterms", cargo.incoterms),
    line("ETD", cargo.etd),
    line("ETA", cargo.eta),
    cargo.special_instructions
      ? `\n*Notes:* ${cargo.special_instructions}`
      : null,
  ];

  return parts
    .filter((l): l is string => l !== null)
    .join("\n")
    .replace(/\n{3,}/g, "\n\n");
}

export async function sendCargoWhatsApp(
  cargo: CargoData,
  subject: string,
): Promise<string> {
  const {
    TWILIO_ACCOUNT_SID,
    TWILIO_AUTH_TOKEN,
    TWILIO_WHATSAPP_FROM,
    WHATSAPP_TO,
  } = process.env;

  if (
    !TWILIO_ACCOUNT_SID ||
    !TWILIO_AUTH_TOKEN ||
    !TWILIO_WHATSAPP_FROM ||
    !WHATSAPP_TO
  ) {
    throw new Error("Twilio environment variables are not fully configured.");
  }

  const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
  const message = await client.messages.create({
    from: TWILIO_WHATSAPP_FROM,
    to: WHATSAPP_TO,
    body: formatCargoMessage(cargo, subject),
  });
  return message.sid;
}
