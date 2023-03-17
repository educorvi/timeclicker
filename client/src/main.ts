import {createApp} from 'vue';
import {createPinia} from 'pinia';
import {createI18n} from "vue-i18n";

import App from './App.vue';
import router from './router';

import './main.scss';

import {ModalPlugin, FormPlugin, FormInputPlugin, FormSelectPlugin, ToastPlugin} from "bootstrap-vue";
import messages from "@/i18n/messages";

const app = createApp(App);

let lang = localStorage.getItem("language");
if (!lang) {
    const navLang = navigator.language.split("-")[0];
    if (Object.keys(messages).includes(navLang)) {
        lang = navLang;
    } else {
        console.info(`Language ${navLang} is not supported. Using en instead.`)
        lang = `en`;
    }
    localStorage.setItem("language", lang);
}

app.use(createPinia());
app.use(router);
app.use(ModalPlugin);
app.use(FormPlugin);
app.use(FormInputPlugin);
app.use(FormSelectPlugin);
app.use(ToastPlugin);
app.use(createI18n({
    locale: lang,
    legacy: false,
    fallbackLocale: 'en',
    messages,
    datetimeFormats: {
        'en': {
            short: {
                year: 'numeric', month: 'short', day: 'numeric',
            },
            long: {
                year: 'numeric', month: 'short', day: 'numeric',
                weekday: 'short', hour: 'numeric', minute: 'numeric'
            }
        },
        'de': {
            short: {
                year: 'numeric', month: 'short', day: 'numeric'
            },
            long: {
                year: 'numeric', month: 'short', day: 'numeric',
                weekday: 'short', hour: 'numeric', minute: 'numeric'
            }
        },
    }
}))

app.mount('#app');
