# @icebreakers/ability

轻量级的 Vue 3 权限能力辅助库，专注于「登录后从后端拉取 roles + permissions，刷新后可能变化」的场景。

## 设计方案（中文）

### 背景

- 项目通常在登录或刷新时，从后端获取 `roles` 与 `permissions`。
- 前端需要一个可更新的能力实例，以便 UI 与路由权限即时刷新。

### 目标

- 用最小 API 覆盖绝大多数权限判断场景。
- 能随登录/刷新更新权限，并驱动 Vue 响应式更新。
- 不强依赖 Pinia/Vuex，保持框架无关。

### 核心设计

- 提供 `createRolePermissionAbility`，内部维护 `roles` 与 `permissions` 集合。
- 每次更新权限触发 `updated` 事件，配合 `reactiveAbility` 让 `<Can>` 与 `useAbility()` 自动响应。
- `<Can>` 组件以 **r/p 直传** 为核心，支持 `any/all` 模式，且可反向判断。

### 数据流示意

1. 登录或刷新 -> 拉取 `{ roles, permissions }`。
2. Store 更新状态，同时调用 `ability.update(payload)`。
3. `<Can>` 与 `useAbility().can/hasRole/hasPermission` 自动重新计算。

### 兼容性

- `abilitiesPlugin` 只要求 `ability.can()`，因此仍支持自定义能力实例。
- `<Can>` 依赖 `hasRole` / `hasPermission`（推荐使用 `createRolePermissionAbility`）。

## 快速开始（基础能力）

```ts
import { abilitiesPlugin } from '@icebreakers/ability'
import { createApp } from 'vue'
import App from './App.vue'

const permissions = ['system:dept:add', 'system:config:export']

const ability = {
  can(permission: string) {
    // eslint-disable-next-line unicorn/prefer-includes -- explicit some() usage in docs
    return permissions.some(item => item === permission)
  },
}

createApp(App)
  .use(abilitiesPlugin, ability, { useGlobalProperties: true })
  .mount('#app')
```

## 推荐用法：Roles + Permissions

### 创建能力实例

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
```

### 登录/刷新后更新

```ts
// 登录或刷新后从后端获取 roles + permissions
ability.update({ roles: ['admin'], permissions: ['system:dept:add', 'system:config:export'] })
```

### 在组件中使用

```vue
<script setup lang="ts">
import { Can, useAbility } from '@icebreakers/ability'

const { can } = useAbility()
</script>

<template>
  <div v-if="$can('system:dept:add')">
    You can add departments.
  </div>
  <Can :p="['system:dept:add']">
    Visible by permission.
  </Can>
  <Can :r="['admin', 'ops']">
    Visible by role.
  </Can>
  <Can :p="['system:dept:add', 'system:config:export']" mode="all">
    Requires both permissions.
  </Can>
  <div v-if="can('system:dept:add')">
    useAbility().can 也可直接使用
  </div>
</template>
```

### 使用 $can / $ability（全局注入）

前提：在注册插件时开启 `useGlobalProperties: true`。

```ts
createApp(App)
  .use(abilitiesPlugin, ability, { useGlobalProperties: true })
  .mount('#app')
```

```vue
<template>
  <button :disabled="!$can('system:config:export')">
    导出配置
  </button>
  <div v-if="$can('system:dept:add')">
    允许新增部门
  </div>
  <div v-if="$ability.hasPermission('system:config:export')">
    允许导出配置
  </div>
  <div v-if="$ability.hasRole('admin')">
    管理员入口
  </div>
</template>
```

### 使用 useAbility（组合式 API）

```ts
import { useAbility } from '@icebreakers/ability'
import { computed } from 'vue'

const { can, hasPermission, hasRole } = useAbility()

const canAddDept = computed(() => can('system:dept:add'))
const canExportConfig = computed(() => can('system:config:export'))
const isAdmin = computed(() => hasRole?.('admin'))
```

### useAbility 使用场景（建议）

- 需要在 `setup()` 中计算权限开关（按钮可用性、功能模块开关）。
- 需要在脚本逻辑中做权限判断（请求前检查、事件处理、数据过滤）。
- 需要把权限判断封装为组合式函数，在多个组件复用。
- 不适合用 `<Can>` 的场景（非模板逻辑、需要多条件组合）。

### useAbility 推荐写法（强类型）

如果使用 `createRolePermissionAbility`，建议显式标注类型，这样 `hasRole/hasPermission` 可直接使用。

```ts
import type { RolePermissionAbility } from '@icebreakers/ability'
import { useAbility } from '@icebreakers/ability'
import { computed } from 'vue'

const ability = useAbility<RolePermissionAbility>()

const canExportConfig = computed(() => ability.hasPermission('system:config:export'))
const canRemoveUser = computed(() => ability.hasPermission('system:user:remove'))
const isAdmin = computed(() => ability.hasRole('admin'))
```

### 注意事项

- `useAbility()` 只能在 `setup()` 或组合式函数内使用。
- 路由守卫、store 模块等非 `setup` 环境，请直接导入能力实例（例如 `import { ability } from './ability'`）进行判断。

## 权限字符串规则

- 默认格式：`subject:action`，分隔符为 `:`，常见形态为 `system:dept:add`（最后一段为 action）。
- 通配符：`*`，示例：`system:dept:*`、`*:export`、`*:*`。
- 只传 action 也可（如 `read`），用于极简权限。
- 可通过 `order: 'action:subject'` 切换格式。

## createRolePermissionAbility 选项

- `separator`: 权限字符串分隔符，默认 `:`
- `wildcard`: 通配符字符，默认 `*`
- `order`: `'subject:action' | 'action:subject'`，默认 `subject:action`
- `normalize`: 权限字符串归一化函数（如转小写、去空格）
- `permissionMatcher`: 自定义权限判断函数，覆盖默认匹配逻辑

## createRolePermissionAbility 方法

- `update(snapshot?)`: 更新角色与权限（支持空值重置）
- `setRoles(roles)` / `setPermissions(permissions)`: 单独更新
- `reset()`: 重置为空（可视为登出）
- `hasRole(role)` / `hasPermission(permission)`: 直接判断
- `getSnapshot()`: 获取当前快照
- `on/off/subscribe`: 监听 `updated` 事件（供响应式更新）

## <Can> 组件（中文）

### Props

- `r`：角色数组（string[]）
- `p`：权限数组（string[]）
- `mode`：`'any' | 'all'`，默认 `any`
- `not`：反向判断
- `passThrough`：插槽参数透传 `{ allowed, ability }`

### 判定逻辑

- 默认 `mode="any"`：任一角色或权限命中即通过。
- 同时传入 `r` 与 `p` 时，**默认任意命中即可**。
- 需要全部匹配时使用 `mode="all"`。

### 示例

```vue
<script setup lang="ts">
import { Can } from '@icebreakers/ability'
</script>

<template>
  <Can :p="['system:dept:add']">
    拥有 system:dept:add 权限时显示
  </Can>
  <Can :p="['system:dept:add', 'system:config:export']" mode="all">
    需要全部权限
  </Can>
  <Can :r="['admin']">
    拥有 admin 角色时显示
  </Can>
  <Can :r="['admin', 'ops']">
    任意角色即可
  </Can>
  <Can :p="['system:report:read']" not>
    没有权限时显示
  </Can>
  <Can v-slot="{ allowed }" :p="['system:user:remove']" passThrough>
    <span>{{ allowed ? '可移除用户' : '无权限' }}</span>
  </Can>
</template>
```

## 结合 Pinia 的用法

```ts
import { defineStore } from 'pinia'
import { ability } from './ability'
import { fetchAuthProfile } from './services/auth'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    roles: [] as string[],
    permissions: [] as string[],
  }),
  actions: {
    async refreshAuth() {
      const payload = await fetchAuthProfile()
      this.roles = payload.roles
      this.permissions = payload.permissions
      ability.update(payload)
    },
  },
})
```

## 结合 Vuex 的用法

```ts
import { createStore } from 'vuex'
import { ability } from './ability'
import { fetchAuthProfile } from './services/auth'

export const store = createStore({
  state: () => ({
    roles: [] as string[],
    permissions: [] as string[],
  }),
  mutations: {
    setAuth(state, payload: { roles: string[], permissions: string[] }) {
      state.roles = payload.roles
      state.permissions = payload.permissions
    },
  },
  actions: {
    async refreshAuth({ commit }) {
      const payload = await fetchAuthProfile()
      commit('setAuth', payload)
      ability.update(payload)
    },
  },
})
```

## 路由守卫示例

```ts
import { createRouter } from 'vue-router'
import { ability } from './ability'

const router = createRouter({
  history,
  routes,
})

router.beforeEach((to) => {
  const metaPermission = to.meta?.permission as string | undefined
  if (!metaPermission) {
    return true
  }

  if (!ability.hasPermission?.(metaPermission)) {
    return { name: '403' }
  }

  return true
})
```

## 子树能力覆盖（provideAbility）

```ts
import { createRolePermissionAbility, provideAbility } from '@icebreakers/ability'

const childAbility = createRolePermissionAbility({
  roles: ['auditor'],
  permissions: ['*:read'],
})

provideAbility(childAbility)
```

## 自定义匹配 permissionMatcher

```ts
import { createRolePermissionAbility } from '@icebreakers/ability'

const ability = createRolePermissionAbility(
  { permissions: ['system:dept:add'] },
  {
    permissionMatcher: (permission) => {
      const allowList = ['system:dept:add']
      // eslint-disable-next-line unicorn/prefer-includes -- explicit some() usage in docs
      return allowList.some(item => item === permission)
    },
  },
)
```

## API 速查

- `abilitiesPlugin(app, ability, options)`：注册能力实例
- `useAbility()`：注入能力实例
- `provideAbility(ability)`：为子树提供能力实例
- `<Can>`：基于 r/p 渲染
- `createRolePermissionAbility(snapshot?, options?)`：创建角色/权限能力
