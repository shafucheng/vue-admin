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
        meta: { title: 'Home' },
        component: () => import('@/views/HomeView'),
      },
      {
        path: 'about',
        meta: { title: 'About' },
        component: () => import('@/views/AboutView'),
      },
    ],
  },
]

const recursionRoutes = (routes: RouteRecordRaw[]) => {
  routes.map((route) => {
    if (typeof route.name === 'undefined') {
      route.name = Symbol()
    }
    if (route.children) {
      recursionRoutes(route.children)
    }
  })
}

recursionRoutes(routes)

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
