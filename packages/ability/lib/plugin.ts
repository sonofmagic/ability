import type { App } from 'vue'
import type { AbilityLike } from './types'
import { reactiveAbility } from './reactiveAbility'
import { ABILITY_TOKEN } from './useAbility'

export interface AbilityPluginOptions {
  useGlobalProperties?: boolean
}

export function abilitiesPlugin(app: App, ability: AbilityLike, options?: AbilityPluginOptions) {
  if (!ability || typeof ability.can !== 'function') {
    throw new Error('Please provide an Ability instance with a "can" method to abilitiesPlugin')
  }

  const reactive = reactiveAbility(ability)
  app.provide(ABILITY_TOKEN, reactive)

  if (options?.useGlobalProperties) {
    app.config.globalProperties.$ability = reactive
    app.config.globalProperties.$can = reactive.can.bind(reactive)
  }
}
