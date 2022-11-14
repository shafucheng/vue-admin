import { PageContainer } from '@ant-design-vue/pro-layout'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AboutView',
  setup: () => {
    return () => {
      return (
        <PageContainer>
          <div>About</div>
        </PageContainer>
      )
    }
  },
})
