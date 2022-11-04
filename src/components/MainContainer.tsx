import { TypographyText } from 'ant-design-vue'
import { defineComponent } from 'vue'

import BlockContainer from '@/components/BlockContainer'

export default defineComponent({
  name: 'MainContainer',
  props: {
    title: {
      type: String,
      default: '',
    },
  },
  setup: (props, { slots }) => {
    return () => {
      return (
        <BlockContainer>
          <div class={'py-4 flex justify-between'}>
            <div
              class={
                'h-8 flex items-center font-sans text-base font-medium leading-none'
              }
            >
              <TypographyText>{props.title}</TypographyText>
            </div>
            {slots.action?.()}
          </div>
          {slots.default?.()}
        </BlockContainer>
      )
    }
  },
})
