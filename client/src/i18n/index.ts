import { createI18n } from 'vue-i18n';
import messages from '@/i18n/messages';

let lang = localStorage.getItem('language');
if (!lang) {
    const navLang = navigator.language.split('-')[0];
    if (Object.keys(messages).includes(navLang)) {
        lang = navLang;
    } else {
        console.info(`Language ${navLang} is not supported. Using en instead.`);
        lang = `en`;
    }
    localStorage.setItem('language', lang);
}

export default createI18n({
    locale: lang,
    legacy: false,
    fallbackLocale: 'en',
    messages,
    datetimeFormats: {
        en: {
            short: {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
            },
            long: {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                weekday: 'short',
                hour: 'numeric',
                minute: 'numeric',
            },
        },
        de: {
            short: {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
            },
            long: {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                weekday: 'short',
                hour: 'numeric',
                minute: 'numeric',
            },
        },
    },
});
