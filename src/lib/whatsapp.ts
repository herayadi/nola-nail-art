export const WHATSAPP_NUMBER = "6285161699605";

/**
 * Builds a WhatsApp wa.me URL with optional pre-filled message
 */
export const buildWhatsAppUrl = (message?: string): string => {
  const baseUrl = `https://wa.me/${WHATSAPP_NUMBER}`;
  
  if (!message) {
    return baseUrl;
  }
  
  // Encode the message for URL
  const encodedMessage = encodeURIComponent(message);
  return `${baseUrl}?text=${encodedMessage}`;
};

export const COMMON_MESSAGES = {
  general: "Halo Nola Nail Art! Saya ingin tanya-tanya nih.",
  booking: "Halo Nola Nail Art! Saya ingin booking appointment.",
  consultation: "Halo Nola Nail Art! Saya ingin konsultasi desain sebelum booking.",
};
