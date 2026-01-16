import { defineStore } from 'pinia'
import { ability } from '../ability'
import { fetchAuthProfile } from '../services/auth'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    roles: [] as string[],
    permissions: [] as string[],
    loading: false,
    lastUpdated: 'never',
  }),
  actions: {
    async refreshAuth() {
      this.loading = true
      try {
        const payload = await fetchAuthProfile()
        this.roles = payload.roles
        this.permissions = payload.permissions
        this.lastUpdated = new Date().toLocaleTimeString()
        ability.update(payload)
      }
      finally {
        this.loading = false
      }
    },
  },
})
