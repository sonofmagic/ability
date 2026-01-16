import { nextTick, watchEffect } from 'vue'
import { reactiveAbility } from '../lib/reactiveAbility'
import { createRolePermissionAbility } from '../lib/rolePermissionAbility'

describe('createRolePermissionAbility', () => {
  it('matches exact permissions', () => {
    const ability = createRolePermissionAbility({
      permissions: ['system:dept:add'],
    })

    expect(ability.can('add', 'system:dept')).toBe(true)
    expect(ability.can('remove', 'system:dept')).toBe(false)
  })

  it('supports wildcards and action-only permissions', () => {
    const ability = createRolePermissionAbility({
      permissions: ['system:dept:*', '*:export', 'read'],
    })

    expect(ability.can('add', 'system:dept')).toBe(true)
    expect(ability.can('export', 'system:config')).toBe(true)
    expect(ability.can('read', 'system:user')).toBe(true)
    expect(ability.can('remove', 'system:user')).toBe(false)
  })

  it('matches permissions with wildcard via hasPermission', () => {
    const ability = createRolePermissionAbility({
      permissions: ['system:dept:*', '*:export'],
    })

    expect(ability.hasPermission('system:dept:add')).toBe(true)
    expect(ability.hasPermission('system:config:export')).toBe(true)
    expect(ability.hasPermission('system:user:remove')).toBe(false)
  })

  it('supports action:subject ordering', () => {
    const ability = createRolePermissionAbility(
      { permissions: ['add:system:dept'] },
      { order: 'action:subject' },
    )

    expect(ability.can('add', 'system:dept')).toBe(true)
    expect(ability.can('add', 'system:user')).toBe(false)
  })

  it('normalizes inputs when configured', () => {
    const ability = createRolePermissionAbility(
      { permissions: ['system:config:export'] },
      { normalize: value => value.toLowerCase() },
    )

    expect(ability.can('EXPORT', 'SYSTEM:CONFIG')).toBe(true)
  })

  it('notifies listeners when permissions change', () => {
    const ability = createRolePermissionAbility()
    let calls = 0
    ability.on?.('updated', () => {
      calls += 1
    })

    ability.update({ permissions: ['system:dept:add'] })
    ability.update({ permissions: ['system:dept:add'] })
    ability.setPermissions(['system:dept:remove'])

    expect(calls).toBe(2)
  })

  it('re-triggers reactiveAbility on updates', async () => {
    const base = createRolePermissionAbility({ permissions: ['system:dept:add'] })
    const reactive = reactiveAbility(base)

    let runs = 0
    watchEffect(() => {
      reactive.can('add', 'system:dept')
      runs += 1
    })

    expect(runs).toBe(1)

    base.setPermissions(['system:dept:remove'])
    await nextTick()

    expect(runs).toBe(2)
  })
})
