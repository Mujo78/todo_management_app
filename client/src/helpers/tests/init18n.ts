import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import engJSON from "../../locale/en/en.json";
import enAPIJSON from "../../locale/en/en.api.json";
import bsJSON from "../../locale/bs/bs.json";
import bsAPIJSON from "../../locale/bs/bs.api.json";

i18next.use(initReactI18next).init({
  resources: {
    eng: {
      translation: { ...engJSON, ...enAPIJSON },
    },
    bs: {
      translation: { ...bsJSON, ...bsAPIJSON },
    },
  },
  interpolation: {
    escapeValue: false,
  },
  lng: "eng",
  fallbackLng: "eng",
  //debug: true,
});

export default i18next;
