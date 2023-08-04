import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import router from './router'
import store from "./store";
import './style.css'
import App from './App.vue'
import Vue3Marquee from 'vue3-marquee'
createApp(App).use(store).use(Vue3Marquee).use(ElementPlus).use(router).mount('#app')
