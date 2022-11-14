import { PageContainer } from '@ant-design-vue/pro-layout'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'HomeView',
  setup: () => {
    return () => {
      return (
        <PageContainer>
          <div>Home</div>
        </PageContainer>
      )
    }
  },
})
