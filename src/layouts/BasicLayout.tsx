import { HomeOutlined } from '@ant-design/icons-vue'
import ProLayout, {
  clearMenuItem,
  getMenuData,
} from '@ant-design-vue/pro-layout'
import type { BreadcrumbRender } from '@ant-design-vue/pro-layout/dist/RenderTypings'
import { defineComponent, watchEffect } from 'vue'
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'

import { routeNameBasicLayout } from '@/router'

export default defineComponent({
  name: 'BasicLayout',
  setup: () => {
    const route = useRoute()
    const router = useRouter()
    const { menuData } = getMenuData(clearMenuItem(router.getRoutes()))

    const collapsed = $ref(false)
    let selectedKeys = $ref<string[]>([])
    let openKeys = $ref<string[]>([])

    const breadcrumb = $computed(() =>
      route.matched.map((item) => ({
        path: item.path,
        breadcrumbName: item.meta.title || '',
      })),
    )

    watchEffect(() => {
      selectedKeys = route.matched
        .filter(({ name }) => name !== routeNameBasicLayout)
        .map(({ path }) => path)
      openKeys = route.matched
        .filter(({ path }) => path !== route.path)
        .map(({ path }) => path)
    })

    return () => {
      return (
        <div class={'h-screen'}>
          <ProLayout
            v-models={[
              [collapsed, 'collapsed'],
              [selectedKeys, 'selectedKeys'],
              [openKeys, 'openKeys'],
            ]}
            logo={null}
            title={'Vue Admin'}
            navTheme={'realDark'}
            layout={'mix'}
            fixedHeader={true}
            fixSiderbar={true}
            menuData={menuData}
            breadcrumb={{
              routes: breadcrumb,
            }}
          >
            {{
              default: () => <RouterView />,
              breadcrumbRender: (({ route, params, routes }) => {
                const index = routes.indexOf(route)
                if (index === 0) {
                  return (
                    <span>
                      <HomeOutlined />
                      {route.breadcrumbName}
                    </span>
                  )
                }
                if (index === routes.length - 1) {
                  return <span>{route.breadcrumbName}</span>
                }
                return (
                  <RouterLink to={{ path: route.path, params }}>
                    {route.breadcrumbName}
                  </RouterLink>
                )
              }) as BreadcrumbRender,
            }}
          </ProLayout>
        </div>
      )
    }
  },
})
