import { createI18n } from "vue-i18n";
import config from "~/app-config";
import messages from "./dictionary";

const savedLang = localStorage.getItem("planguage");

function getBrowserLanguage() {
  const language = navigator.language;
  if (language) {
    return language.includes("ru") ? "ru" : "en";
  }
}

config.lang = savedLang || getBrowserLanguage() || config.defaultLanguage;

const i18n = new createI18n({
  locale: config.lang,
  fallbackLocale: "en",
  silentTranslationWarn: false,
  messages,
  pluralizationRules: {
    ru: function (choice, choicesLength) {
      if (choice === 0) {
        return 0;
      }

      const teen = choice > 10 && choice < 20;
      const endsWithOne = choice % 10 === 1;

      if (choicesLength < 4) {
        return !teen && endsWithOne ? 1 : 2;
      }
      if (!teen && endsWithOne) {
        return 1;
      }
      if (!teen && choice % 10 >= 2 && choice % 10 <= 4) {
        return 2;
      }

      return choicesLength < 4 ? 2 : 3;
    },
  },
});

export default i18n;
