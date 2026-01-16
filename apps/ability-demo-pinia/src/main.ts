import { abilitiesPlugin } from '@icebreakers/ability'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import { ability } from './ability'
import App from './App.vue'
import './style.css'

const app = createApp(App)
app.use(createPinia())
app.use(abilitiesPlugin, ability, { useGlobalProperties: true })
app.mount('#app')
