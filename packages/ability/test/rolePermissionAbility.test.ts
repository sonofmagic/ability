import { nextTick, watchEffect } from 'vue'
import { reactiveAbility } from '../lib/reactiveAbility'
import { createRolePermissionAbility } from '../lib/rolePermissionAbility'

describe('createRolePermissionAbility', () => {
  it('matches exact permissions', () => {
    const ability = createRolePermissionAbility({
      permissions: ['Post:read'],
    })

    expect(ability.can('read', 'Post')).toBe(true)
    expect(ability.can('edit', 'Post')).toBe(false)
  })

  it('supports wildcards and action-only permissions', () => {
    const ability = createRolePermissionAbility({
      permissions: ['Post:*', '*:manage', 'read'],
    })

    expect(ability.can('edit', 'Post')).toBe(true)
    expect(ability.can('manage', 'User')).toBe(true)
    expect(ability.can('read', 'User')).toBe(true)
    expect(ability.can('delete', 'User')).toBe(false)
  })

  it('matches permissions with wildcard via hasPermission', () => {
    const ability = createRolePermissionAbility({
      permissions: ['*:read', 'post:*'],
    })

    expect(ability.hasPermission('report:read')).toBe(true)
    expect(ability.hasPermission('post:edit')).toBe(true)
    expect(ability.hasPermission('user:manage')).toBe(false)
  })

  it('supports action:subject ordering', () => {
    const ability = createRolePermissionAbility(
      { permissions: ['read:Post'] },
      { order: 'action:subject' },
    )

    expect(ability.can('read', 'Post')).toBe(true)
    expect(ability.can('read', 'Comment')).toBe(false)
  })

  it('normalizes inputs when configured', () => {
    const ability = createRolePermissionAbility(
      { permissions: ['post:read'] },
      { normalize: value => value.toLowerCase() },
    )

    expect(ability.can('READ', 'Post')).toBe(true)
  })

  it('notifies listeners when permissions change', () => {
    const ability = createRolePermissionAbility()
    let calls = 0
    ability.on?.('updated', () => {
      calls += 1
    })

    ability.update({ permissions: ['Post:read'] })
    ability.update({ permissions: ['Post:read'] })
    ability.setPermissions(['Post:edit'])

    expect(calls).toBe(2)
  })

  it('re-triggers reactiveAbility on updates', async () => {
    const base = createRolePermissionAbility({ permissions: ['Post:read'] })
    const reactive = reactiveAbility(base)

    let runs = 0
    watchEffect(() => {
      reactive.can('read', 'Post')
      runs += 1
    })

    expect(runs).toBe(1)

    base.setPermissions(['Post:edit'])
    await nextTick()

    expect(runs).toBe(2)
  })
})
