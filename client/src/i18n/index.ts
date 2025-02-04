import { createI18n } from 'vue-i18n';
import messages from '@/i18n/messages';
import { en } from '@/i18n/messages/english';

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

export const humanizeDurationShortLangConfig = {
    language: "shortLang",
    languages: {
        shortLang: {
            y: () => "y",
            mo: () => "mo",
            w: () => "w",
            d: () => "d",
            h: () => "h",
            m: () => "m",
            s: () => "s",
            ms: () => "ms",
        },
    },
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
            time: {
                hour: 'numeric',
                minute: 'numeric',
            }
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
            time: {
                hour: 'numeric',
                minute: 'numeric',
            }
        },
    },
});
