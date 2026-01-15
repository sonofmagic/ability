import type { AbilityLike } from './types'
import { ref } from 'vue'

const REACTIVE_FLAG = Symbol('abilityReactive')

type ReactiveAbility = AbilityLike & {
  [REACTIVE_FLAG]?: true
}

export function reactiveAbility<T extends AbilityLike>(ability: T): T {
  const reactiveAbilityInstance = ability as ReactiveAbility

  if (reactiveAbilityInstance[REACTIVE_FLAG]) {
    return ability
  }

  const watcher = ref(0)
  const notifyUpdate = () => {
    watcher.value += 1
  }
  const track = () => watcher.value

  if (typeof ability.on === 'function') {
    ability.on('updated', notifyUpdate)
  }
  else if (typeof ability.subscribe === 'function') {
    ability.subscribe(notifyUpdate)
  }

  const originalCan = ability.can.bind(ability)
  ability.can = ((action: string, subject?: unknown, field?: string) => {
    track()
    return originalCan(action, subject, field)
  }) as T['can']

  if (typeof ability.cannot === 'function') {
    const originalCannot = ability.cannot.bind(ability)
    ability.cannot = ((action: string, subject?: unknown, field?: string) => {
      track()
      return originalCannot(action, subject, field)
    }) as NonNullable<T['cannot']>
  }

  Object.defineProperty(ability, REACTIVE_FLAG, { value: true })

  return ability
}
