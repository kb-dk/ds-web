import { createI18n } from 'vue-i18n';

const i18n = createI18n({
	locale: 'da',
	fallbackLocale: 'da',
	messages: {
		da: require('./locales/da.json'),
		en: require('./locales/en.json'),
	},
});

export default i18n;
