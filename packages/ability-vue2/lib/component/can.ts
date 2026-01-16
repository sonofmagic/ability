import type { PropType } from 'vue'
import type { AbilityLike } from '../types'
import { defineComponent } from 'vue'
import { useAbility } from '../useAbility'

type CheckMode = 'any' | 'all'

type RolePermissionAbilityLike = AbilityLike & {
  hasRole?: (role: string) => boolean
  hasPermission?: (permission: string) => boolean
}

export interface CanProps {
  r?: string | string[]
  p?: string | string[]
  mode?: CheckMode
  not?: boolean
  passThrough?: boolean
}

function normalizeList(value?: string | string[]) {
  if (!value) {
    return []
  }

  return Array.isArray(value) ? value : [value]
}

function mergeLists(first: string[], second: string[]) {
  const merged = [...first, ...second]
  const seen = new Set<string>()
  const result: string[] = []

  for (const item of merged) {
    const trimmed = item.trim()
    if (!trimmed || seen.has(trimmed)) {
      continue
    }

    seen.add(trimmed)
    result.push(trimmed)
  }

  return result
}

export const Can = defineComponent<CanProps>({
  name: 'Can',
  props: {
    r: [String, Array] as PropType<string | string[]>,
    p: [String, Array] as PropType<string | string[]>,
    mode: {
      type: String as PropType<CheckMode>,
      default: 'any',
    },
    not: Boolean,
    passThrough: Boolean,
  },
  setup(props, { slots }) {
    if (!slots.default) {
      throw new Error('Expects to receive default slot')
    }

    const render = slots.default
    const ability = useAbility<RolePermissionAbilityLike>()

    return () => {
      const roleList = mergeLists(normalizeList(props.r), [])
      const permissionList = mergeLists(normalizeList(props.p), [])

      if (roleList.length === 0 && permissionList.length === 0) {
        throw new Error('Please provide `r` or `p` to <Can>')
      }

      if (roleList.length > 0 && typeof ability.hasRole !== 'function') {
        throw new Error('Ability instance does not provide `hasRole` for <Can>')
      }

      if (permissionList.length > 0 && typeof ability.hasPermission !== 'function') {
        throw new Error('Ability instance does not provide `hasPermission` for <Can>')
      }

      const checks: boolean[] = []

      if (roleList.length > 0) {
        const hasRole = ability.hasRole as (role: string) => boolean
        for (const role of roleList) {
          checks.push(hasRole(role))
        }
      }

      if (permissionList.length > 0) {
        const hasPermission = ability.hasPermission as (permission: string) => boolean
        for (const permission of permissionList) {
          checks.push(hasPermission(permission))
        }
      }

      const isAllowed = props.mode === 'all' ? checks.every(Boolean) : checks.some(Boolean)
      const canRender = props.not ? !isAllowed : isAllowed

      if (!props.passThrough) {
        return canRender ? render() : null
      }

      return render({
        allowed: canRender,
        ability,
      })
    }
  },
})
