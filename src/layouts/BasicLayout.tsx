import ProLayout, {
  clearMenuItem,
  getMenuData,
} from '@ant-design-vue/pro-layout'
import { defineComponent, watchEffect } from 'vue'
import { RouterView, useRoute, useRouter } from 'vue-router'

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
            <RouterView />
          </ProLayout>
        </div>
      )
    }
  },
})
