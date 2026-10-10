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
      "next": "Davom etish",
      // Bottom nav
      "nav.book": "Buyurtma",
      "nav.myOrders": "Buyurtmalarim",
      "nav.myOffers": "Takliflarim",
      "nav.drivers": "Yo'lovchilar",
      "nav.profile": "Profil",
      "nav.wallet": "Hamyon",
      "nav.stats": "Statistika",
      "nav.members": "A'zolar",
      "nav.settings": "Sozlamalar",
      // Settings
      "settings.title": "Sozlamalar"
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
      "next": "Продолжить",
      "nav.book": "Заказ",
      "nav.myOrders": "Мои заказы",
      "nav.myOffers": "Мои предложения",
      "nav.drivers": "Пассажиры",
      "nav.profile": "Профиль",
      "nav.wallet": "Кошелёк",
      "nav.stats": "Статистика",
      "nav.members": "Участники",
      "nav.settings": "Настройки",
      "settings.title": "Настройки"
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
