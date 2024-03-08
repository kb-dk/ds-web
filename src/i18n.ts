import { createI18n } from 'vue-i18n';
import daLocale from './locales/da.json';
import enLocale from './locales/en.json';

const i18n = createI18n({
	legacy: false,
	locale: 'da',
	fallbackLocale: 'da',
	messages: {
		da: daLocale,
    en: enLocale,
	},
});

export default i18n;
