import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'

export default createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: Home },
    { path: '/module1d', component: () => import('../_Module1D/page1D.vue') },
    { path: '/module2d', component: () => import('../_Module2D/page2D.vue') },
  ],
})
