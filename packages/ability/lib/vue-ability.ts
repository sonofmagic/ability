import type { RolePermissionAbility } from './rolePermissionAbility'

declare module 'vue' {
  interface ComponentCustomProperties {
    $ability: RolePermissionAbility
    $can: RolePermissionAbility['can']
  }
}

export {}
