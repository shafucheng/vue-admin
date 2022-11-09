import { defineComponent } from 'vue'

export default defineComponent({
  name: 'TableActionSpace',
  setup: (props, { slots }) => {
    return () => {
      return <div class={'flex flex-wrap gap-x-2'}>{slots.default?.()}</div>
    }
  },
})
