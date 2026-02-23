import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import zh from './zh'
import en from './en'
import es from './es'

i18n.use(initReactI18next).init({
  resources: {
    zh: { translation: zh },
    en: { translation: en },
    es: { translation: es },
  },
  lng: (typeof localStorage !== 'undefined' && localStorage.getItem('lang')) || 'zh',
  fallbackLng: 'zh',
  interpolation: { escapeValue: false },
})

export default i18n
