/**
 * Supported languages for Alt Text generation
 * Each language includes configuration for the AI prompt
 */

export interface AltTextLanguage {
  code: string;
  name: string;
  nativeName: string;
  rtl?: boolean;
  promptInstruction: string;
}

export const ALT_TEXT_LANGUAGES: Record<string, AltTextLanguage> = {
  en: {
    code: "en",
    name: "English",
    nativeName: "English",
    promptInstruction: "Generate the alt text in English using clear, descriptive language.",
  },
  es: {
    code: "es",
    name: "Spanish",
    nativeName: "Espanol",
    promptInstruction: "Genera el texto alternativo en espanol, usando un lenguaje claro y descriptivo. Asegurate de usar la gramatica y el vocabulario correctos del espanol.",
  },
  fr: {
    code: "fr",
    name: "French",
    nativeName: "Francais",
    promptInstruction: "Generez le texte alternatif en francais, en utilisant un langage clair et descriptif. Assurez-vous d'utiliser la grammaire et le vocabulaire francais corrects.",
  },
  de: {
    code: "de",
    name: "German",
    nativeName: "Deutsch",
    promptInstruction: "Generieren Sie den Alternativtext auf Deutsch mit einer klaren, beschreibenden Sprache. Achten Sie auf korrekte deutsche Grammatik und Vokabular.",
  },
  it: {
    code: "it",
    name: "Italian",
    nativeName: "Italiano",
    promptInstruction: "Genera il testo alternativo in italiano, usando un linguaggio chiaro e descrittivo. Assicurati di usare la grammatica e il vocabolario italiani corretti.",
  },
  pt: {
    code: "pt",
    name: "Portuguese",
    nativeName: "Portugues",
    promptInstruction: "Gere o texto alternativo em portugues, usando uma linguagem clara e descritiva. Certifique-se de usar a gramatica e o vocabulario portugueses corretos.",
  },
  nl: {
    code: "nl",
    name: "Dutch",
    nativeName: "Nederlands",
    promptInstruction: "Genereer de alternatieve tekst in het Nederlands met duidelijke, beschrijvende taal. Zorg voor correcte Nederlandse grammatica en woordenschat.",
  },
  pl: {
    code: "pl",
    name: "Polish",
    nativeName: "Polski",
    promptInstruction: "Wygeneruj tekst alternatywny po polsku, uzywajac jasnego, opisowego jezyka. Upewnij sie, ze uzywasz poprawnej polskiej gramatyki i slownictwa.",
  },
  ru: {
    code: "ru",
    name: "Russian",
    nativeName: "Russkij",
    promptInstruction: "Generate the alt text in Russian using clear, descriptive language with proper Russian grammar.",
  },
  ja: {
    code: "ja",
    name: "Japanese",
    nativeName: "Nihongo",
    promptInstruction: "Generate the alt text in Japanese. Use natural Japanese phrasing and appropriate honorific levels for general audiences.",
  },
  zh: {
    code: "zh",
    name: "Chinese (Simplified)",
    nativeName: "Zhongwen",
    promptInstruction: "Generate the alt text in Simplified Chinese using clear, descriptive language with proper Chinese grammar and vocabulary.",
  },
  "zh-TW": {
    code: "zh-TW",
    name: "Chinese (Traditional)",
    nativeName: "Zhongwen (Traditional)",
    promptInstruction: "Generate the alt text in Traditional Chinese using clear, descriptive language with proper Chinese grammar and vocabulary.",
  },
  ko: {
    code: "ko",
    name: "Korean",
    nativeName: "Hangugeo",
    promptInstruction: "Generate the alt text in Korean using clear, descriptive language with proper Korean grammar and appropriate politeness level.",
  },
  ar: {
    code: "ar",
    name: "Arabic",
    nativeName: "Arabiyyah",
    rtl: true,
    promptInstruction: "Generate the alt text in Arabic using clear, descriptive Modern Standard Arabic with proper grammar.",
  },
  hi: {
    code: "hi",
    name: "Hindi",
    nativeName: "Hindi",
    promptInstruction: "Generate the alt text in Hindi using clear, descriptive language with proper Hindi grammar and vocabulary.",
  },
  tr: {
    code: "tr",
    name: "Turkish",
    nativeName: "Turkce",
    promptInstruction: "Alternatif metni Turkce olarak, acik ve betimleyici bir dil kullanarak olusturun. Dogru Turkce dilbilgisi ve kelime dagarcindan emin olun.",
  },
  vi: {
    code: "vi",
    name: "Vietnamese",
    nativeName: "Tieng Viet",
    promptInstruction: "Generate the alt text in Vietnamese using clear, descriptive language with proper Vietnamese grammar and vocabulary.",
  },
  th: {
    code: "th",
    name: "Thai",
    nativeName: "Phasa Thai",
    promptInstruction: "Generate the alt text in Thai using clear, descriptive language with proper Thai grammar and vocabulary.",
  },
  id: {
    code: "id",
    name: "Indonesian",
    nativeName: "Bahasa Indonesia",
    promptInstruction: "Buat teks alternatif dalam Bahasa Indonesia dengan menggunakan bahasa yang jelas dan deskriptif dengan tata bahasa yang benar.",
  },
  uk: {
    code: "uk",
    name: "Ukrainian",
    nativeName: "Ukrayinska",
    promptInstruction: "Generate the alt text in Ukrainian using clear, descriptive language with proper Ukrainian grammar and vocabulary.",
  },
} as const;

/**
 * Get language configuration by code
 */
export function getLanguageConfig(code: string): AltTextLanguage | undefined {
  return ALT_TEXT_LANGUAGES[code];
}

/**
 * Get all supported language codes
 */
export function getSupportedLanguageCodes(): string[] {
  return Object.keys(ALT_TEXT_LANGUAGES);
}

/**
 * Get languages as array for Select component
 */
export function getLanguagesForSelect(): { value: string; label: string; nativeName: string }[] {
  return Object.values(ALT_TEXT_LANGUAGES).map((lang) => ({
    value: lang.code,
    label: lang.name,
    nativeName: lang.nativeName,
  }));
}
