import { PageContainer } from '@ant-design-vue/pro-layout'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AboutView',
  setup: () => {
    return () => {
      return (
        <PageContainer fixedHeader={true}>
          <div>About</div>
        </PageContainer>
      )
    }
  },
})
