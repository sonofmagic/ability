<script setup lang="ts">
import { Can, useAbility } from '@icebreakers/ability'
import { computed, onMounted } from 'vue'
import { useAuthStore } from './stores/auth'

const store = useAuthStore()
const { can } = useAbility()

const roles = computed(() => store.roles)
const permissions = computed(() => store.permissions)
const loading = computed(() => store.loading)
const lastUpdated = computed(() => store.lastUpdated)

const canPublish = computed(() => can('publish', 'post'))
const canManageUsers = computed(() => can('manage', 'user'))

const refresh = () => store.refreshAuth()

onMounted(() => {
  refresh()
})
</script>

<template>
  <div class="page">
    <header class="hero">
      <div>
        <p class="eyebrow">Pinia + Ability</p>
        <h1>角色权限刷新演示</h1>
        <p class="lead">
          模拟后端登录/刷新返回 roles + permissions。点击刷新按钮，权限立刻更新，
          <code>&lt;Can&gt;</code> 与 <code>useAbility()</code> 同步生效。
        </p>
      </div>
      <div class="hero-actions">
        <button class="primary" :disabled="loading" @click="refresh">
          {{ loading ? '正在刷新…' : '刷新权限' }}
        </button>
        <div class="meta">最后更新：{{ lastUpdated }}</div>
      </div>
    </header>

    <section class="panel">
      <div class="panel-header">
        <h2>当前身份</h2>
        <p>根据后端返回的列表渲染权限。</p>
      </div>
      <div class="pill-stack">
        <div>
          <div class="label">Roles</div>
          <div class="pill-list">
            <span v-for="role in roles" :key="role" class="pill">{{ role }}</span>
            <span v-if="roles.length === 0" class="pill empty">none</span>
          </div>
        </div>
        <div>
          <div class="label">Permissions</div>
          <div class="pill-list">
            <span v-for="permission in permissions" :key="permission" class="pill">
              {{ permission }}
            </span>
            <span v-if="permissions.length === 0" class="pill empty">none</span>
          </div>
        </div>
      </div>
    </section>

    <section class="grid">
      <article class="card" style="--delay: 0ms">
        <h3>内容权限</h3>
        <Can permission="post:read">
          <p class="status yes">可阅读帖子</p>
        </Can>
        <Can permission="post:edit">
          <p class="status yes">可编辑帖子</p>
        </Can>
        <Can permission="post:delete" not>
          <p class="status no">暂时不能删除帖子</p>
        </Can>
      </article>

      <article class="card" style="--delay: 120ms">
        <h3>用户权限</h3>
        <Can permission="user:manage" passThrough v-slot="{ allowed }">
          <p :class="['status', allowed ? 'yes' : 'no']">
            {{ allowed ? '可以管理用户' : '没有管理用户权限' }}
          </p>
        </Can>
        <p class="hint">这个卡片使用了 <code>passThrough</code> 插槽。</p>
      </article>

      <article class="card" style="--delay: 240ms">
        <h3>直接调用</h3>
        <p class="status" :class="canPublish ? 'yes' : 'no'">
          发布权限：{{ canPublish ? '已解锁' : '未开放' }}
        </p>
        <p class="status" :class="canManageUsers ? 'yes' : 'no'">
          管理权限：{{ canManageUsers ? '已解锁' : '未开放' }}
        </p>
        <p class="hint">来自 <code>useAbility().can</code>。</p>
      </article>
    </section>
  </div>
</template>
