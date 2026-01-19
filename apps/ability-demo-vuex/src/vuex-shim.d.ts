declare module 'vuex' {
  import type { App, InjectionKey } from 'vue'

  export interface Store<S> {
    state: S
    dispatch: (type: string, payload?: unknown) => Promise<unknown> | void
    install: (app: App, key?: InjectionKey<Store<S>>) => void
  }

  export interface StoreOptions<S> {
    state?: S | (() => S)
    modules?: Record<string, unknown>
  }

  export function createStore<S>(options: StoreOptions<S>): Store<S>
  export function useStore<S = unknown>(): Store<S>
}
