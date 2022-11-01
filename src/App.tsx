import { ConfigProvider } from 'ant-design-vue'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import { defineComponent } from 'vue'
import { RouterView } from 'vue-router'

export default defineComponent({
  name: 'App',
  setup: () => {
    return () => {
      return (
        <ConfigProvider locale={zhCN}>
          <RouterView />
        </ConfigProvider>
      )
    }
  },
})
