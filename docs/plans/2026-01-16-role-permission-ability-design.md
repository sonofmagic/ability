# Role/Permission Ability Design

## Goal

Improve `@icebreakers/ability` for apps that load roles + permissions at login and refresh them on page reload, and add two Vue 3 demo apps (Pinia + Vuex) that show common usage patterns.

## Architecture

- Add a role/permission-aware ability creator to `packages/ability` that fits backend payloads like `{ roles: string[], permissions: string[] }`.
- Keep the package framework-agnostic: no Pinia/Vuex dependency, but provide an ability instance that can be updated by any store.
- Use the existing reactive wrapper so `Can` and `useAbility()` react when permissions refresh.

## API

New module: `packages/ability/lib/rolePermissionAbility.ts` and re-exports from `packages/ability/lib/index.ts`.

Types:

- `RolePermissionSnapshot` with optional `roles` and `permissions` arrays.
- `RolePermissionAbilityOptions` with `separator`, `wildcard`, `order`, optional `normalize` and `permissionMatcher`.
- `RolePermissionAbility` extends `AbilityLike` and adds:
  - `update(snapshot)`
  - `setRoles(roles)`
  - `setPermissions(permissions)`
  - `reset()`
  - `hasRole(role)`
  - `hasPermission(permission)`
  - `getSnapshot()`

Behavior:

- Default permission matching resolves subject to a string and builds keys using a configurable separator and order.
- Supports wildcard matching (subject, action, or full `*`).
- Optional `permissionMatcher` overrides the default algorithm.
- `cannot` derived from `can` for completeness.
- Emits `updated` events when state changes (supports `on`, `off`, `subscribe`).

## Demo Apps

Create two Vite + Vue 3 apps under `apps/`:

- `apps/ability-demo-pinia`
- `apps/ability-demo-vuex`

Each demo:

- Simulates backend auth with `fetchAuthProfile()` returning `{ roles, permissions }`.
- On refresh, store updates its auth state and calls `ability.update(payload)`.
- UI shows current roles/permissions, gated content via `<Can>`, and direct `can()` checks.
- Includes a button to refresh permissions and show reactive changes after reload.

## Error Handling & Edge Cases

- Missing snapshot values default to empty arrays.
- Undefined update payload resets to a logged-out state.
- Falsy action returns `false` to avoid accidental allow.
- Subject resolution is conservative and never throws.
- Listener management is safe; unsubscribing is idempotent.
- `permissionMatcher` errors return `false` instead of crashing the app.

## Testing

- Add unit tests for permission matching (exact and wildcard) and update notifications.
- Validate that `reactiveAbility` responds to `updated` events from the new ability.
- Demos include a manual refresh flow to validate reactivity.
