import { createApp } from 'vue'
import { abilitiesPlugin, createRolePermissionAbility } from '~/index'
import App from './App.vue'
import { router } from './router'
import './style.css'

const app = createApp(App)
app.use(router)
const ability = createRolePermissionAbility(
  { roles: ['admin'], permissions: ['post:read', 'post:edit', 'user:manage'] },
  { normalize: value => value.toLowerCase() },
)
app.use(abilitiesPlugin, ability, { useGlobalProperties: true })
app.mount('#app')
