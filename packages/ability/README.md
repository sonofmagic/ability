# @icebreakers/ability

Lightweight Vue 3 ability helpers inspired by `@casl/vue`, without CASL dependency.

## Usage

```ts
import { abilitiesPlugin } from '@icebreakers/ability'
import { createApp } from 'vue'
import App from './App.vue'

const ability = {
  can(action: string, subject?: unknown) {
    return action === 'read' && subject === 'Post'
  },
}

createApp(App)
  .use(abilitiesPlugin, ability, { useGlobalProperties: true })
  .mount('#app')
```

## Role/Permission helper

```ts
import { abilitiesPlugin, createRolePermissionAbility } from '@icebreakers/ability'
import { createApp } from 'vue'
import App from './App.vue'

const ability = createRolePermissionAbility(
  { roles: [], permissions: [] },
  { normalize: value => value.toLowerCase() },
)

createApp(App)
  .use(abilitiesPlugin, ability, { useGlobalProperties: true })
  .mount('#app')

// After login or refresh:
// ability.update({ roles: ['admin'], permissions: ['post:read', 'post:edit'] })
```

```vue
<script setup lang="ts">
import { Can, useAbility } from '@icebreakers/ability'

const { can } = useAbility()
</script>

<template>
  <div v-if="$can?.('read', 'Post')">
    You can read posts.
  </div>
  <Can permission="post:read">
    Visible by permission.
  </Can>
  <Can :roles="['admin', 'ops']">
    Visible by role.
  </Can>
  <Can :permissions="['post:read', 'post:edit']" mode="all">
    Requires both permissions.
  </Can>
</template>
```

## 中文文档

### 快速开始

```ts
import { abilitiesPlugin, createRolePermissionAbility } from '@icebreakers/ability'
import { createApp } from 'vue'
import App from './App.vue'

const ability = createRolePermissionAbility(
  { roles: [], permissions: [] },
  { normalize: value => value.toLowerCase() },
)

createApp(App)
  .use(abilitiesPlugin, ability, { useGlobalProperties: true })
  .mount('#app')

// 登录或刷新后从后端获取 roles + permissions
// ability.update({ roles: ['admin'], permissions: ['post:read', 'post:edit'] })
```

```vue
<script setup lang="ts">
import { Can } from '@icebreakers/ability'
</script>

<template>
  <Can permission="post:read">
    拥有 post:read 权限时显示
  </Can>
  <Can :permissions="['post:read', 'post:edit']" mode="all">
    需要全部权限
  </Can>
  <Can role="admin">
    拥有 admin 角色时显示
  </Can>
  <Can :roles="['admin', 'ops']">
    任意角色即可
  </Can>
  <Can :permissions="['report:read']" not>
    没有权限时显示
  </Can>
  <Can v-slot="{ allowed }" :permissions="['user:manage']" passThrough>
    <span>{{ allowed ? '可管理用户' : '无权限' }}</span>
  </Can>
</template>
```

### 权限字符串规则

- 默认格式为 `subject:action`，分隔符为 `:`。
- 支持通配符 `*`：例如 `post:*`、`*:read` 或 `*:*`。
- 可通过 `order: 'action:subject'` 切换成 `action:subject` 格式。
- 若需要自定义匹配规则，可传入 `permissionMatcher` 完全接管判断逻辑。

### `createRolePermissionAbility` 选项

- `separator`: 权限字符串分隔符，默认 `:`
- `wildcard`: 通配符字符，默认 `*`
- `order`: `'subject:action' | 'action:subject'`，默认 `subject:action`
- `normalize`: 权限字符串归一化函数（如转小写、去空格）
- `permissionMatcher`: 自定义权限判断函数，覆盖默认匹配逻辑

### `<Can>` Props（中文）

- `role` / `roles`：字符串或字符串数组
- `permission` / `permissions`：字符串或字符串数组
- `mode`：`'any' | 'all'`，默认 `any`
- `not`：反向判断
- `passThrough`：插槽参数透传 `{ allowed, ability }`
- `<Can>` 依赖 `hasRole` / `hasPermission`（推荐使用 `createRolePermissionAbility`）。

## API

- `abilitiesPlugin(app, ability, options)` registers the reactive ability instance.
- `useAbility()` injects the ability instance.
- `provideAbility(ability)` provides a scoped ability for a subtree.
- `Can` component renders based on provided role/permission checks.
- `createRolePermissionAbility(snapshot?, options?)` creates an ability with role/permission helpers.

### `<Can>` props

- `role` / `roles`: string or string[]
- `permission` / `permissions`: string or string[]
- `mode`: `'any' | 'all'` (default: `any`)
- `not`: invert the result
- `passThrough`: expose `{ allowed, ability }` in slot props
- `Can` expects an ability that implements `hasRole`/`hasPermission` (e.g., `createRolePermissionAbility`).
