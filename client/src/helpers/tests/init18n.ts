import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import engJSON from "../../locale/en.json";
import bsJSON from "../../locale/bs.json";

i18next.use(initReactI18next).init({
  resources: {
    eng: { ...engJSON },
    bs: { ...bsJSON },
  },
  interpolation: {
    escapeValue: false,
  },
  lng: "eng",
  fallbackLng: "eng",
  debug: true,
});

export default i18next;
