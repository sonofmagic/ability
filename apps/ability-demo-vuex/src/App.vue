<script setup lang="ts">
import { Can, useAbility } from '@icebreakers/ability'
import { computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import type { RootState } from './store'

const store = useStore<RootState>()
const { can } = useAbility()

const roles = computed(() => store.state.auth.roles)
const permissions = computed(() => store.state.auth.permissions)
const loading = computed(() => store.state.auth.loading)
const lastUpdated = computed(() => store.state.auth.lastUpdated)

const canExportConfig = computed(() => can('system:config:export'))
const canAddDept = computed(() => can('system:dept:add'))

const refresh = () => store.dispatch('auth/refreshAuth')

onMounted(() => {
  refresh()
})
</script>

<template>
  <div class="viewport">
    <header class="mast">
      <div>
        <p class="signal">Vuex Control Deck</p>
        <h1>权限脉冲控制台</h1>
        <p class="sub">
          Vuex 维护 auth 状态，Ability 根据刷新结果即时更新。切换身份看看权限门禁如何变化。
        </p>
      </div>
      <div class="actions">
        <button class="pulse" :disabled="loading" @click="refresh">
          {{ loading ? '同步中…' : '刷新权限' }}
        </button>
        <div class="timestamp">更新于 {{ lastUpdated }}</div>
      </div>
    </header>

    <section class="board">
      <div class="panel">
        <div class="panel-title">Roles</div>
        <div class="chips">
          <span v-for="role in roles" :key="role" class="chip">{{ role }}</span>
          <span v-if="roles.length === 0" class="chip muted">none</span>
        </div>
      </div>
      <div class="panel">
        <div class="panel-title">Permissions</div>
        <div class="chips">
          <span v-for="permission in permissions" :key="permission" class="chip">{{ permission }}</span>
          <span v-if="permissions.length === 0" class="chip muted">none</span>
        </div>
      </div>
    </section>

    <section class="grid">
      <article class="module" style="--delay: 0ms">
        <h3>系统权限</h3>
        <Can :p="['system:config:export']">
          <p class="flag ok">允许导出配置</p>
        </Can>
        <Can :p="['system:dept:add']">
          <p class="flag ok">允许新增部门</p>
        </Can>
        <Can :p="['system:user:remove']" not>
          <p class="flag warn">用户移除被锁定</p>
        </Can>
      </article>

      <article class="module" style="--delay: 120ms">
        <h3>报表视图</h3>
        <Can :p="['system:report:read']" passThrough v-slot="{ allowed }">
          <p :class="['flag', allowed ? 'ok' : 'warn']">
            {{ allowed ? '可以查看报表' : '没有报表权限' }}
          </p>
        </Can>
        <p class="note">支持 <code>*:read</code> 通配。</p>
      </article>

      <article class="module" style="--delay: 240ms">
        <h3>直接检查</h3>
        <p :class="['flag', canExportConfig ? 'ok' : 'warn']">
          配置导出：{{ canExportConfig ? '可用' : '不可用' }}
        </p>
        <p :class="['flag', canAddDept ? 'ok' : 'warn']">
          新增部门：{{ canAddDept ? '可用' : '不可用' }}
        </p>
        <p class="note">来自 <code>useAbility()</code>。</p>
      </article>
    </section>
  </div>
</template>
