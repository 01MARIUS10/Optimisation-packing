import './assets/main.css'

import { createApp } from 'vue'
import VueKonva from 'vue-konva'
import router from './router'
import App from './App.vue'

createApp(App).use(VueKonva).use(router).mount('#app')
