import { createApp } from "vue";

import { createRouter, createWebHistory } from 'vue-router'
import { routes } from 'vue-router/auto-routes'

import { createPinia } from 'pinia'

import App from './App.vue'

import 'element-plus/theme-chalk/src/message.scss'
import 'element-plus/theme-chalk/src/message-box.scss'


const app = createApp(App);
app.use(createRouter({
  history: createWebHistory(),
  routes,
})).use(createPinia());

app.mount("#app");