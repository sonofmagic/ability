# Vue 2.7 Ability Package Design

## Goal

Provide a Vue 2.7 compatible package `@icebreakers/ability-vue2` with the same public API as the Vue 3 package, including `createRolePermissionAbility`, `abilitiesPlugin`, `useAbility`, `provideAbility`, and the `Can` component.

## Architecture

- Create a new workspace package at `packages/ability-vue2` published as `@icebreakers/ability-vue2`.
- Keep ability logic framework-agnostic: reuse the same role/permission matching and reactive notification model.
- Implement Vue-specific code for Vue 2.7: plugin install, `provide/inject`, and `Can` component.
- Provide Vue 2 type augmentation so `$ability`/`$can` are required on `Vue` instances.

## Public API (Same as Vue 3)

- `abilitiesPlugin(Vue, ability, options)`
- `useAbility()`
- `provideAbility(ability)`
- `createRolePermissionAbility(snapshot?, options?)`
- `reactiveAbility(ability)`
- `Can` component with role/permission props

## Vue 2.7 Implementation Details

- Plugin uses `Vue.use(abilitiesPlugin, ability, { useGlobalProperties: true })`.
- Global injection via `Vue.prototype.$ability` and `Vue.prototype.$can`.
- `useAbility` and `provideAbility` use Vue 2.7 Composition API `inject/provide` from `vue`.
- `Can` matches Vue 3 behavior: accepts `role(s)`, `permission(s)`, `mode`, `not`, `passThrough`.

## Types

- Add `types.d.ts` to augment `vue/types/vue` with required `$ability` and `$can`.
- Export ability-related types for app usage.

## Build/Test

- `peerDependencies` set to `vue@^2.7.0`.
- Use the same build tooling as existing packages.
- Reuse matching logic unit tests; add Vue 2 `Can` rendering tests if needed.

## Usage Example

```ts
import { abilitiesPlugin, createRolePermissionAbility } from '@icebreakers/ability-vue2'
import Vue from 'vue'

const ability = createRolePermissionAbility({ roles: [], permissions: [] })
Vue.use(abilitiesPlugin, ability, { useGlobalProperties: true })
```
