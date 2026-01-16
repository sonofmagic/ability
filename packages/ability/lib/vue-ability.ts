import type { AbilityLike } from './types'

declare module 'vue' {
  interface ComponentCustomProperties {
    $ability: AbilityLike
    $can: AbilityLike['can']
  }
}

export {}
