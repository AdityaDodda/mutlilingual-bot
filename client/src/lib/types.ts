export interface File {
  id: number;
  userId: string;
  originalName: string;
  filename: string;
  mimeType: string;
  size: number;
  sourceLanguage?: string;
  targetLanguages?: string[];
  status: "uploaded" | "processing" | "completed" | "failed";
  conversionProgress?: number;
  outputFormats?: string[];
  metadata?: any;
  createdAt: string;
  updatedAt: string;
}

export interface ConvertedFile {
  id: number;
  originalFileId: number;
  targetLanguage: string;
  filename: string;
  outputFormat: string;
  size: number;
  downloadUrl?: string;
  createdAt: string;
}

export interface ConversionJob {
  id: number;
  fileId: number;
  status: "pending" | "processing" | "completed" | "failed";
  progress: number;
  errorMessage?: string;
  startedAt?: string;
  completedAt?: string;
  createdAt: string;
}

export interface User {
  id: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
  preferredLanguage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserPreferences {
  id: number;
  userId: string;
  notificationSettings: {
    conversionComplete?: boolean;
    errorNotifications?: boolean;
    weeklyDigest?: boolean;
    productUpdates?: boolean;
  };
  defaultSourceLanguage?: string;
  defaultTargetLanguages?: string[];
  theme?: "light" | "dark" | "system";
  createdAt: string;
  updatedAt: string;
}

export interface Language {
  code: string;
  name: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: Language[] = [
  { code: "es", name: "Spanish", flag: "🇪🇸" },
  { code: "fr", name: "French", flag: "🇫🇷" },
  { code: "de", name: "German", flag: "🇩🇪" },
  { code: "it", name: "Italian", flag: "🇮🇹" },
  { code: "pt", name: "Portuguese", flag: "🇵🇹" },
  { code: "ja", name: "Japanese", flag: "🇯🇵" },
  { code: "ko", name: "Korean", flag: "🇰🇷" },
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "zh-CN", name: "Chinese (Simplified)", flag: "🇨🇳" },
  { code: "zh-TW", name: "Chinese (Traditional)", flag: "🇹🇼" },
  { code: "ar", name: "Arabic", flag: "🇸🇦" },
  { code: "ru", name: "Russian", flag: "🇷🇺" },
  { code: "hi", name: "Hindi", flag: "🇮🇳" },
  { code: "nl", name: "Dutch", flag: "🇳🇱" },
  { code: "sv", name: "Swedish", flag: "🇸🇪" },
  { code: "no", name: "Norwegian", flag: "🇳🇴" },
  { code: "da", name: "Danish", flag: "🇩🇰" },
  { code: "fi", name: "Finnish", flag: "🇫🇮" },
  { code: "pl", name: "Polish", flag: "🇵🇱" },
  { code: "cs", name: "Czech", flag: "🇨🇿" },
  { code: "sk", name: "Slovak", flag: "🇸🇰" },
  { code: "hu", name: "Hungarian", flag: "🇭🇺" },
  { code: "ro", name: "Romanian", flag: "🇷🇴" },
  { code: "bg", name: "Bulgarian", flag: "🇧🇬" },
  { code: "hr", name: "Croatian", flag: "🇭🇷" },
  { code: "sr", name: "Serbian", flag: "🇷🇸" },
  { code: "sl", name: "Slovenian", flag: "🇸🇮" },
  { code: "et", name: "Estonian", flag: "🇪🇪" },
  { code: "lv", name: "Latvian", flag: "🇱🇻" },
  { code: "lt", name: "Lithuanian", flag: "🇱🇹" },
  { code: "mt", name: "Maltese", flag: "🇲🇹" },
  { code: "ga", name: "Irish", flag: "🇮🇪" },
  { code: "cy", name: "Welsh", flag: "🏴󠁧󠁢󠁷󠁬󠁳󠁿" },
  { code: "is", name: "Icelandic", flag: "🇮🇸" },
  { code: "tr", name: "Turkish", flag: "🇹🇷" },
  { code: "he", name: "Hebrew", flag: "🇮🇱" },
  { code: "th", name: "Thai", flag: "🇹🇭" },
  { code: "vi", name: "Vietnamese", flag: "🇻🇳" },
  { code: "id", name: "Indonesian", flag: "🇮🇩" },
  { code: "ms", name: "Malay", flag: "🇲🇾" },
  { code: "tl", name: "Filipino", flag: "🇵🇭" },
  { code: "sw", name: "Swahili", flag: "🇰🇪" },
  { code: "am", name: "Amharic", flag: "🇪🇹" },
  { code: "fa", name: "Persian", flag: "🇮🇷" },
  { code: "ur", name: "Urdu", flag: "🇵🇰" },
  { code: "bn", name: "Bengali", flag: "🇧🇩" },
  { code: "ta", name: "Tamil", flag: "🇱🇰" },
  { code: "te", name: "Telugu", flag: "🇮🇳" },
  { code: "ml", name: "Malayalam", flag: "🇮🇳" },
  { code: "kn", name: "Kannada", flag: "🇮🇳" },
  { code: "gu", name: "Gujarati", flag: "🇮🇳" },
  { code: "pa", name: "Punjabi", flag: "🇮🇳" },
  { code: "mr", name: "Marathi", flag: "🇮🇳" },
  { code: "ne", name: "Nepali", flag: "🇳🇵" },
  { code: "si", name: "Sinhala", flag: "🇱🇰" },
  { code: "my", name: "Myanmar", flag: "🇲🇲" },
  { code: "km", name: "Khmer", flag: "🇰🇭" },
  { code: "lo", name: "Lao", flag: "🇱🇦" },
  { code: "ka", name: "Georgian", flag: "🇬🇪" },
  { code: "hy", name: "Armenian", flag: "🇦🇲" },
  { code: "az", name: "Azerbaijani", flag: "🇦🇿" },
  { code: "kk", name: "Kazakh", flag: "🇰🇿" },
  { code: "ky", name: "Kyrgyz", flag: "🇰🇬" },
  { code: "uz", name: "Uzbek", flag: "🇺🇿" },
  { code: "tk", name: "Turkmen", flag: "🇹🇲" },
  { code: "tg", name: "Tajik", flag: "🇹🇯" },
  { code: "mn", name: "Mongolian", flag: "🇲🇳" },
  { code: "bo", name: "Tibetan", flag: "🏔️" },
  { code: "dz", name: "Dzongkha", flag: "🇧🇹" },
  { code: "or", name: "Odia", flag: "🇮🇳" },
  { code: "as", name: "Assamese", flag: "🇮🇳" },
  { code: "sd", name: "Sindhi", flag: "🇵🇰" },
  { code: "ps", name: "Pashto", flag: "🇦🇫" },
  { code: "ckb", name: "Kurdish", flag: "🏴" },
  { code: "ku", name: "Kurdish", flag: "🏴" },
  { code: "yi", name: "Yiddish", flag: "🏴" },
  { code: "eu", name: "Basque", flag: "🏴" },
  { code: "ca", name: "Catalan", flag: "🏴" },
  { code: "gl", name: "Galician", flag: "🏴" },
  { code: "oc", name: "Occitan", flag: "🏴" },
  { code: "br", name: "Breton", flag: "🏴" },
  { code: "co", name: "Corsican", flag: "🏴" },
  { code: "sc", name: "Sardinian", flag: "🏴" },
  { code: "lij", name: "Ligurian", flag: "🏴" },
  { code: "vec", name: "Venetian", flag: "🏴" },
  { code: "nap", name: "Neapolitan", flag: "🏴" },
  { code: "scn", name: "Sicilian", flag: "🏴" },
  { code: "lmo", name: "Lombard", flag: "🏴" },
  { code: "pms", name: "Piedmontese", flag: "🏴" },
  { code: "rm", name: "Romansh", flag: "🇨🇭" },
  { code: "fur", name: "Friulian", flag: "🏴" },
  { code: "lld", name: "Ladin", flag: "🏴" },
  { code: "hsb", name: "Upper Sorbian", flag: "🏴" },
  { code: "dsb", name: "Lower Sorbian", flag: "🏴" },
  { code: "csb", name: "Kashubian", flag: "🏴" },
  { code: "szl", name: "Silesian", flag: "🏴" },
  { code: "rue", name: "Rusyn", flag: "🏴" },
  { code: "be", name: "Belarusian", flag: "🇧🇾" },
  { code: "uk", name: "Ukrainian", flag: "🇺🇦" },
  { code: "mk", name: "Macedonian", flag: "🇲🇰" },
  { code: "sq", name: "Albanian", flag: "🇦🇱" },
  { code: "el", name: "Greek", flag: "🇬🇷" },
  { code: "la", name: "Latin", flag: "🏛️" },
  { code: "gd", name: "Scottish Gaelic", flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿" },
  { code: "gv", name: "Manx", flag: "🇮🇲" },
  { code: "kw", name: "Cornish", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" },
  { code: "fo", name: "Faroese", flag: "🇫🇴" },
  { code: "se", name: "Northern Sami", flag: "🏴" },
  { code: "smj", name: "Lule Sami", flag: "🏴" },
  { code: "sma", name: "Southern Sami", flag: "🏴" },
  { code: "smn", name: "Inari Sami", flag: "🏴" },
  { code: "sms", name: "Skolt Sami", flag: "🏴" },
  { code: "fkv", name: "Kven", flag: "🏴" },
  { code: "fit", name: "Tornedalen Finnish", flag: "🏴" },
  { code: "vro", name: "Võro", flag: "🏴" },
  { code: "liv", name: "Livonian", flag: "🏴" },
  { code: "vot", name: "Votic", flag: "🏴" },
  { code: "izh", name: "Ingrian", flag: "🏴" },
  { code: "krl", name: "Karelian", flag: "🏴" },
  { code: "olo", name: "Livvi", flag: "🏴" },
  { code: "lud", name: "Ludic", flag: "🏴" },
  { code: "vep", name: "Veps", flag: "🏴" }
];