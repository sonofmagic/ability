# @icebreakers/ability-vue2

面向 Vue 2.7 的权限能力辅助库，API 与 Vue 3 版本保持一致。

## 安装

```bash
pnpm add @icebreakers/ability-vue2
```

## 快速开始

```ts
import { abilitiesPlugin, createRolePermissionAbility } from '@icebreakers/ability-vue2'
import Vue from 'vue'

const ability = createRolePermissionAbility({ roles: [], permissions: [] })

Vue.use(abilitiesPlugin, ability, { useGlobalProperties: true })
```

## 使用 $can / $ability

```vue
<template>
  <button :disabled="!$can('system:config:export')">
    导出配置
  </button>
  <div v-if="$ability.hasRole('admin')">
    管理员入口
  </div>
</template>
```

## 使用 <Can>

```vue
<script setup lang="ts">
import { Can } from '@icebreakers/ability-vue2'
</script>

<template>
  <Can :p="['system:dept:add']">
    可新增部门
  </Can>
  <Can :p="['system:dept:add', 'system:config:export']" mode="all">
    全部权限
  </Can>
</template>
```
