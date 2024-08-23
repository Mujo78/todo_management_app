import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enJSON from "./locale/en/en.json";
import enAPIJSON from "./locale/en/en.api.json";
import bsJSON from "./locale/bs/bs.json";
import bsAPIJSON from "./locale/bs/bs.api.json";

const lng = localStorage.getItem("lng") ?? "eng";

i18n.use(initReactI18next).init({
  resources: {
    eng: {
      translation: { ...enJSON, ...enAPIJSON },
    },
    bs: {
      translation: { ...bsJSON, ...bsAPIJSON },
    },
  },
  interpolation: {
    escapeValue: false,
  },
  lng,
  fallbackLng: "eng",
});
