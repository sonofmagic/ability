export type AbilityCan = (action: string, subject?: unknown, field?: string) => boolean

export interface AbilityLike {
  can: AbilityCan
  cannot?: AbilityCan
  hasRole?: (role: string) => boolean
  hasPermission?: (permission: string) => boolean
  on?: (event: 'updated', handler: () => void) => void
  off?: (event: 'updated', handler: () => void) => void
  subscribe?: (handler: () => void) => void | (() => void)
}
