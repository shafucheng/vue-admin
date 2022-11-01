import { PageContainer } from '@ant-design-vue/pro-layout'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'HomeView',
  setup: () => {
    return () => {
      return (
        <PageContainer fixedHeader={true}>
          <div>Home</div>
        </PageContainer>
      )
    }
  },
})
