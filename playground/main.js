import { createApp } from 'vue';
import Vue3Jsoneditor from '../index.js';
import App from './App.vue';

createApp(App).use(Vue3Jsoneditor, { debounce: 0 }).mount('#app');
