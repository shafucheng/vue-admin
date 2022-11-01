import { PageContainer } from '@ant-design-vue/pro-layout'
import { defineComponent } from 'vue'
import { useRoute } from 'vue-router'

export default defineComponent({
  name: 'HomeView',
  setup: () => {
    const route = useRoute()

    return () => {
      return (
        <PageContainer fixedHeader={true} title={route.meta.title}>
          <div>Home</div>
        </PageContainer>
      )
    }
  },
})
