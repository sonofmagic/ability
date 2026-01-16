import type { AbilityLike } from './types'

declare module 'vue/types/vue' {
  interface Vue {
    $ability: AbilityLike
    $can: AbilityLike['can']
  }
}

export {}
