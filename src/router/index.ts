import type { MetaRecord } from '@ant-design-vue/pro-layout'
import { type RouteRecordRaw, createRouter, createWebHistory } from 'vue-router'

declare module 'vue-router' {
  interface RouteMeta extends MetaRecord {}
}

export const routeNameBasicLayout = Symbol()

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: routeNameBasicLayout,
    component: () => import('@/layouts/BasicLayout'),
    children: [
      {
        path: 'home',
        name: Symbol(),
        meta: { title: 'Home' },
        component: () => import('@/views/HomeView'),
      },
      {
        path: 'about',
        name: Symbol(),
        meta: { title: 'About' },
        component: () => import('@/views/AboutView'),
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
