import { createPinia } from 'pinia'
import { createApp } from 'vue'
import './all.css'
import App from './App.vue'
import router from './router'

window.devicePixelRatio = 2.5
const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')
