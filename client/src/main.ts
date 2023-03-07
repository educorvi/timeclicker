import {createApp} from 'vue';
import {createPinia} from 'pinia';
import {createI18n} from "vue-i18n";

import App from './App.vue';
import router from './router';

import './assets/main.scss';

import {ModalPlugin, FormPlugin, FormInputPlugin, FormSelectPlugin, ToastPlugin} from "bootstrap-vue";
import messages from "@/i18n/messages";

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(ModalPlugin);
app.use(FormPlugin);
app.use(FormInputPlugin);
app.use(FormSelectPlugin);
app.use(ToastPlugin);
app.use(createI18n({
    legacy: false,
    locale: 'en',
    fallbackLocale: 'de',
    messages
}))

app.mount('#app');
