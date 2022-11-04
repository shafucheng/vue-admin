import { defineComponent } from 'vue'

import BlockContainer from '@/components/BlockContainer'

export default defineComponent({
  name: 'SearchContainer',
  setup: (props, { slots }) => {
    return () => {
      return <BlockContainer class={'pt-6'}>{slots.default?.()}</BlockContainer>
    }
  },
})
