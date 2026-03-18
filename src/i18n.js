import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  uz_latn: {
    translation: {
      // Splash
      "welcome": "Tasavvuringizdagi Taksi",
      // Lang
      "choose_language": "Tilni tanlang",
      "uzbek": "O'zbekcha",
      "russian": "Русский",
      // Role
      "choose_role": "Kimsiz?",
      "role_subtitle": "Xizmatingizga tayyormiz. Rolingizni tanlang",
      "driver": "Haydovchi",
      "driver_desc": "Safarga chiqib daromad topish",
      "passenger": "Yo'lovchi",
      "passenger_desc": "Oson va tez manzilga yetib olish",
      "next": "Davom etish"
    }
  },
  ru: {
    translation: {
      "welcome": "Такси вашей мечты",
      "choose_language": "Выберите язык",
      "uzbek": "O'zbekcha",
      "russian": "Русский",
      "choose_role": "Кто вы?",
      "role_subtitle": "К вашим услугам. Выберите роль",
      "driver": "Водитель",
      "driver_desc": "Зарабатывайте на поездках",
      "passenger": "Пассажир",
      "passenger_desc": "Быстро и удобно добраться",
      "next": "Продолжить"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('language') || 'uz_latn',
    fallbackLng: "uz_latn",
    interpolation: {
      escapeValue: false 
    }
  });

export default i18n;
