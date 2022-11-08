import 'dayjs/locale/zh-cn'
import 'uno.css'

import { createPinia } from 'pinia'
import { createApp } from 'vue'

import App from '@/App'
import config from '@/config'
import router from '@/router'
import { logSystemInfo } from '@/utils/logSystemInfo'

logSystemInfo()

document.title = config.APP_TITLE

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
