import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('@/views/HomeView'),
    },
    {
      path: '/about',
      component: () => import('@/views/AboutView'),
    },
  ],
})

export default router
