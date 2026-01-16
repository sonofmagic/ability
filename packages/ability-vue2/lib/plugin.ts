import type { VueConstructor } from 'vue'
import type { AbilityLike } from './types'
import { reactiveAbility } from './reactiveAbility'
import { ABILITY_TOKEN } from './useAbility'

export interface AbilityPluginOptions {
  useGlobalProperties?: boolean
}

export function abilitiesPlugin(Vue: VueConstructor, ability: AbilityLike, options?: AbilityPluginOptions) {
  if (!ability || typeof ability.can !== 'function') {
    throw new Error('Please provide an Ability instance with a "can" method to abilitiesPlugin')
  }

  const reactive = reactiveAbility(ability)

  Vue.mixin({
    provide() {
      return {
        [ABILITY_TOKEN]: reactive,
      }
    },
  })

  if (options?.useGlobalProperties) {
    Vue.prototype.$ability = reactive
    Vue.prototype.$can = reactive.can.bind(reactive)
  }
}
