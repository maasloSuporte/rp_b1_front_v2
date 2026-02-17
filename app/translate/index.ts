import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { en } from "./locales/ts/en";
import { ptBR } from "./locales/ts/pt-BR";

const LANGUAGE_STORAGE_KEY = "i18n_lng";

i18n.use(initReactI18next).init({
  lng: typeof window !== "undefined" ? localStorage.getItem(LANGUAGE_STORAGE_KEY) || "pt-BR" : "pt-BR",
  debug: false,
  resources: {
    en: {
      translation: en,
    },
    "pt-BR": {
      translation: ptBR,
    },
  },
  fallbackLng: "pt-BR",
  interpolation: {
    escapeValue: false,
  },
});

i18n.on("languageChanged", (lng) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, lng);
  }
});

export default i18n;
