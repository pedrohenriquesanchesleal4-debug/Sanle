/**
 * Helper de integração com WhatsApp (wa.me)
 * Regra: somente link explícito, normalizado apenas com dígitos, sem envio automático.
 */

export function getWhatsAppNumber(): string {
  const raw =
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ||
    process.env.NEXT_PUBLIC_SANLE_WHATSAPP ||
    "61999999999"; // fallback seguro para DF

  return raw.replace(/\D/g, "");
}

export function buildWhatsAppLink(options?: {
  segmento?: string;
  empresa?: string;
  customText?: string;
}): string {
  const number = getWhatsAppNumber();
  const phone = number.startsWith("55") ? number : `55${number}`;

  let message = "Olá, vim pelo site da Sanle e gostaria de entender como funciona o diagnóstico.";

  if (options?.customText) {
    message = options.customText;
  } else if (options?.empresa && options?.segmento) {
    message = `Olá, sou da ${options.empresa} (${options.segmento}) e vim pelo site da Sanle para mapear um processo.`;
  } else if (options?.segmento) {
    message = `Olá, vim pelo site da Sanle e quero mapear um processo de ${options.segmento}.`;
  }

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
