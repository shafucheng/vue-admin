import { Typography } from 'ant-design-vue'
import { defineComponent } from 'vue'

import BlockContainer from '@/components/BlockContainer'

export default defineComponent({
  name: 'MainContainer',
  props: {
    title: {
      type: String,
      default: '',
    },
    showPaddingBottom: {
      type: Boolean,
      default: false,
    },
  },
  setup: (props, { slots }) => {
    return () => {
      return (
        <BlockContainer class={{ 'pb-4': props.showPaddingBottom }}>
          <div class={'py-4 flex justify-between'}>
            <div
              class={
                'h-8 flex items-center font-sans text-base font-medium leading-none'
              }
            >
              <Typography.Text>{props.title}</Typography.Text>
            </div>
            {slots.action?.()}
          </div>
          {slots.default?.()}
        </BlockContainer>
      )
    }
  },
})
