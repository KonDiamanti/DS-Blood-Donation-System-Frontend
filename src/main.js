import 'bootstrap-vue-3/dist/bootstrap-vue-3.css'; // This should match the actual path
import 'bootstrap/dist/css/bootstrap.css';
import './assets/main.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import router from './router';
import axios from 'axios';
import { useApplicationStore } from './stores/application';
import App from './App.vue';
axios.interceptors.request.use((config) => {
    const applicationStore = useApplicationStore();
    const token = applicationStore.accessToken;
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  }, (error) => {
    return Promise.reject(error);
  });
const app = createApp(App);

app.use(createPinia());
app.use(router);

app.mount('#app');