import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';

import './main.scss';

import {
    ModalPlugin,
    FormPlugin,
    FormInputPlugin,
    FormSelectPlugin,
    ToastPlugin,
} from 'bootstrap-vue';
import i18n from '@/i18n';

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(ModalPlugin);
app.use(FormPlugin);
app.use(FormInputPlugin);
app.use(FormSelectPlugin);
app.use(ToastPlugin);
app.use(i18n);

app.mount('#app');
