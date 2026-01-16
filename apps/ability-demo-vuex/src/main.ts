import { abilitiesPlugin } from '@icebreakers/ability'
import { createApp } from 'vue'
import { ability } from './ability'
import App from './App.vue'
import { store } from './store'
import './style.css'

const app = createApp(App)
app.use(store)
app.use(abilitiesPlugin, ability, { useGlobalProperties: true })
app.mount('#app')
