import { defineComponent } from 'vue'

export default defineComponent({
  name: 'HomeView',
  setup: () => {
    return () => {
      return <h1>Home</h1>
    }
  },
})
