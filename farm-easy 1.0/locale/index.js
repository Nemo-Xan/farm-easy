import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import translations from "./translations";
import * as Localization from "expo-localization";
import AsyncStorage from "@react-native-async-storage/async-storage";

const languageDetector = {
  type: 'languageDetector',
  async: true,
  detect: async (callback) => {
      // We will get back a string like "en-US". We
      // return a string like "en" to match our language
      // files.
      let locale = Localization.locale.split('-')[0]
      let currentLanguage = await AsyncStorage.getItem("@currentLanguage")
      callback(currentLanguage || locale)
  },
  init: () => { },
  cacheUserLanguage: () => { },
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .use(languageDetector)
  .init({
    compatibilityJSON: "v3",
    resources: translations,
    // lng: "fr",

    keySeparator: false, // we do not use keys in form messages.welcome

    interpolation: {
      escapeValue: false, // react already safes from xss
    },
    fallbackLng: 'en'
  });
  

export default i18n;