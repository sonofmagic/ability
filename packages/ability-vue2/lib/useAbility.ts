import type { AbilityLike } from './types'
import { inject, provide } from 'vue'
import { reactiveAbility } from './reactiveAbility'

export const ABILITY_TOKEN = 'icebreakers-ability'

export function useAbility<T extends AbilityLike = AbilityLike>(): T {
  const ability = inject<T>(ABILITY_TOKEN)

  if (!ability) {
    throw new Error('Cannot inject Ability instance because it was not provided')
  }

  return ability
}

export function provideAbility(ability: AbilityLike) {
  provide(ABILITY_TOKEN, reactiveAbility(ability))
}
