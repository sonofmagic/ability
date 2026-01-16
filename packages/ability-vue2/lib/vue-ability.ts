import type { RolePermissionAbility } from './rolePermissionAbility'

declare module 'vue/types/vue' {
  interface Vue {
    $ability: RolePermissionAbility
    $can: RolePermissionAbility['can']
  }
}

export {}
