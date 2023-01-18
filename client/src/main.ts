import {createApp} from 'vue';
import {createPinia} from 'pinia';

import App from './App.vue';
import router from './router';

import './assets/main.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

import {ModalPlugin, FormPlugin, FormInputPlugin, FormSelectPlugin, ToastPlugin} from "bootstrap-vue";

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(ModalPlugin);
app.use(FormPlugin);
app.use(FormInputPlugin);
app.use(FormSelectPlugin);
app.use(ToastPlugin);

app.mount('#app');
