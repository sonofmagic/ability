import { createStore } from 'vuex'
import { ability } from '../ability'
import { fetchAuthProfile } from '../services/auth'

export interface AuthState {
  roles: string[]
  permissions: string[]
  loading: boolean
  lastUpdated: string
}

export interface RootState {
  auth: AuthState
}

const authModule = {
  namespaced: true,
  state: (): AuthState => ({
    roles: [],
    permissions: [],
    loading: false,
    lastUpdated: 'never',
  }),
  mutations: {
    setAuth(state: AuthState, payload: { roles: string[], permissions: string[] }) {
      state.roles = payload.roles
      state.permissions = payload.permissions
    },
    setLoading(state: AuthState, value: boolean) {
      state.loading = value
    },
    setUpdated(state: AuthState, value: string) {
      state.lastUpdated = value
    },
  },
  actions: {
    async refreshAuth({ commit }: { commit: (type: string, payload?: unknown) => void }) {
      commit('setLoading', true)
      try {
        const payload = await fetchAuthProfile()
        commit('setAuth', payload)
        commit('setUpdated', new Date().toLocaleTimeString())
        ability.update(payload)
      }
      finally {
        commit('setLoading', false)
      }
    },
  },
}

export const store = createStore<RootState>({
  modules: {
    auth: authModule,
  },
})
