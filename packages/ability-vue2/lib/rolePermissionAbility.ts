import type { AbilityCan, AbilityLike } from './types'

export interface RolePermissionSnapshot {
  roles?: string[]
  permissions?: string[]
}

export type PermissionOrder = 'subject:action' | 'action:subject'

export interface RolePermissionAbilityOptions {
  separator?: string
  wildcard?: string
  order?: PermissionOrder
  normalize?: (value: string) => string
  permissionMatcher?: (action: string, subject?: unknown, field?: string) => boolean
}

export interface RolePermissionAbility extends AbilityLike {
  update: (snapshot?: RolePermissionSnapshot) => void
  setRoles: (roles: string[]) => void
  setPermissions: (permissions: string[]) => void
  reset: () => void
  hasRole: (role: string) => boolean
  hasPermission: (permission: string) => boolean
  getSnapshot: () => Required<RolePermissionSnapshot>
}

export function resolveSubjectName(subject?: unknown): string {
  if (!subject) {
    return ''
  }

  if (typeof subject === 'string') {
    return subject
  }

  if (typeof subject === 'function') {
    return subject.name ?? ''
  }

  if (typeof subject === 'object') {
    const ctor = (subject as { constructor?: { name?: string } }).constructor
    return ctor?.name ?? ''
  }

  return ''
}

const DEFAULT_OPTIONS: Required<Pick<RolePermissionAbilityOptions, 'separator' | 'wildcard' | 'order'>> = {
  separator: ':',
  wildcard: '*',
  order: 'subject:action',
}

export function createRolePermissionAbility(
  snapshot?: RolePermissionSnapshot,
  options?: RolePermissionAbilityOptions,
): RolePermissionAbility {
  const settings = {
    ...DEFAULT_OPTIONS,
    ...options,
  }

  const normalizeValue = (value: string) => {
    const normalized = settings.normalize ? settings.normalize(value) : value
    return normalized.trim()
  }

  const roles = new Set<string>()
  const permissions = new Set<string>()

  const listeners = new Set<() => void>()

  const notify = () => {
    for (const handler of listeners) {
      handler()
    }
  }

  const ensureArray = (values?: string[]) => {
    if (!values) {
      return []
    }

    return values
      .map(value => normalizeValue(value))
      .filter(value => value.length > 0)
  }

  const setsEqual = (left: Set<string>, right: Set<string>) => {
    if (left.size !== right.size) {
      return false
    }

    for (const value of left) {
      if (!right.has(value)) {
        return false
      }
    }

    return true
  }

  const replaceSet = (target: Set<string>, nextValues: string[]) => {
    const next = new Set(nextValues)
    if (setsEqual(target, next)) {
      return false
    }

    target.clear()
    for (const value of next) {
      target.add(value)
    }

    return true
  }

  const buildPermission = (action: string, subject: string) => {
    return settings.order === 'action:subject'
      ? `${action}${settings.separator}${subject}`
      : `${subject}${settings.separator}${action}`
  }

  const applySnapshot = (next?: RolePermissionSnapshot) => {
    const nextRoles = ensureArray(next?.roles)
    const nextPermissions = ensureArray(next?.permissions)
    const rolesChanged = replaceSet(roles, nextRoles)
    const permissionsChanged = replaceSet(permissions, nextPermissions)

    if (rolesChanged || permissionsChanged) {
      notify()
    }
  }

  let ability: RolePermissionAbility

  const can: AbilityCan = (action, subject, field) => {
    if (!action) {
      return false
    }

    if (typeof settings.permissionMatcher === 'function') {
      try {
        return !!settings.permissionMatcher.call(ability, action, subject, field)
      }
      catch {
        return false
      }
    }

    const normalizedAction = normalizeValue(String(action))
    if (!normalizedAction) {
      return false
    }

    const wildcard = normalizeValue(settings.wildcard)
    const normalizedSubject = normalizeValue(resolveSubjectName(subject))

    const checks = new Set<string>()

    if (normalizedSubject) {
      checks.add(buildPermission(normalizedAction, normalizedSubject))
      checks.add(buildPermission(wildcard, normalizedSubject))
    }

    checks.add(buildPermission(normalizedAction, wildcard))
    checks.add(buildPermission(wildcard, wildcard))
    checks.add(normalizedAction)
    checks.add(wildcard)

    for (const permission of checks) {
      if (permissions.has(permission)) {
        return true
      }
    }

    return false
  }

  ability = {
    can,
    cannot: ((action: string, subject?: unknown, field?: string) => !can(action, subject, field)) as AbilityLike['cannot'],
    update(next?: RolePermissionSnapshot) {
      applySnapshot(next)
    },
    setRoles(nextRoles: string[]) {
      const changed = replaceSet(roles, ensureArray(nextRoles))
      if (changed) {
        notify()
      }
    },
    setPermissions(nextPermissions: string[]) {
      const changed = replaceSet(permissions, ensureArray(nextPermissions))
      if (changed) {
        notify()
      }
    },
    reset() {
      const rolesChanged = replaceSet(roles, [])
      const permissionsChanged = replaceSet(permissions, [])
      if (rolesChanged || permissionsChanged) {
        notify()
      }
    },
    hasRole(role: string) {
      const normalized = normalizeValue(role)
      return normalized.length > 0 && roles.has(normalized)
    },
    hasPermission(permission: string) {
      const normalized = normalizeValue(permission)
      if (!normalized) {
        return false
      }

      const separatorIndex = settings.order === 'action:subject'
        ? normalized.indexOf(settings.separator)
        : normalized.lastIndexOf(settings.separator)
      if (separatorIndex === -1) {
        return can(normalized)
      }

      const first = normalized.slice(0, separatorIndex)
      const second = normalized.slice(separatorIndex + settings.separator.length)

      if (settings.order === 'action:subject') {
        return can(first, second)
      }

      return can(second, first)
    },
    getSnapshot() {
      return {
        roles: Array.from(roles),
        permissions: Array.from(permissions),
      }
    },
    on(event, handler) {
      if (event !== 'updated' || typeof handler !== 'function') {
        return
      }

      listeners.add(handler)
    },
    off(event, handler) {
      if (event !== 'updated' || typeof handler !== 'function') {
        return
      }

      listeners.delete(handler)
    },
    subscribe(handler) {
      if (typeof handler !== 'function') {
        return undefined
      }

      listeners.add(handler)
      return () => {
        listeners.delete(handler)
      }
    },
  }

  applySnapshot(snapshot)

  return ability
}
