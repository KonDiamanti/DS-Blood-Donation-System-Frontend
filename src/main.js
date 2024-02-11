import 'bootstrap-vue-3/dist/bootstrap-vue-3.css'; // This should match the actual path
import 'bootstrap/dist/css/bootstrap.css';
import './assets/main.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.mount('#app');