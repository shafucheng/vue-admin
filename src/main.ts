import 'dayjs/locale/zh-cn'
import 'ant-design-vue/lib/style/default.less'
import '@ant-design-vue/pro-layout/dist/style.less'
import 'uno.css'

import { createPinia } from 'pinia'
import { createApp } from 'vue'

import App from '@/App'
import router from '@/router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
