import "i18next";
import type { TranslationsType } from "@/translate/translations";

declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: "translation";
    resources: {
      translation: TranslationsType;
    };
  }
}
