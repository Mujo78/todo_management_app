import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enJSON from "./locale/en.json";
import bsJSON from "./locale/bs.json";

const lng = localStorage.getItem("lng") ?? "eng";

i18n.use(initReactI18next).init({
  resources: {
    eng: { ...enJSON },
    bs: { ...bsJSON },
  },
  interpolation: {
    escapeValue: false,
  },
  lng,
  fallbackLng: "eng",
});
