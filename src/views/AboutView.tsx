import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AboutView',
  setup: () => {
    return () => {
      return <h1>About</h1>
    }
  },
})
