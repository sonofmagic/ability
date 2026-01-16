import { createRolePermissionAbility } from '@icebreakers/ability'

export const ability = createRolePermissionAbility(
  { roles: [], permissions: [] },
  { normalize: value => value.toLowerCase() },
)
