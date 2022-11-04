import { defineComponent } from 'vue'

export default defineComponent({
  name: 'BlockContainer',
  setup: (props, { slots }) => {
    return () => {
      return (
        <div class={'bg-white px-6 mt-4 rounded-sm'}>{slots.default?.()}</div>
      )
    }
  },
})
