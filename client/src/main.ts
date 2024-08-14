import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { createBootstrap } from 'bootstrap-vue-next';

import App from './App.vue';
import router from './router';

import './styles/main.scss';
import '@educorvi/vue-json-form/dist/vue-json-form.css';

import i18n from '@/i18n';

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(createBootstrap());
app.use(i18n);

app.mount('#app');
