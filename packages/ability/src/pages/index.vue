<script setup lang="ts">
import { Can } from '~/index'
</script>

<template>
  <section style="padding: 32px; max-width: 720px; margin: 0 auto;">
    <h1>Ability Playground</h1>
    <p>Use <code>&lt;Can&gt;</code> with role/permission props.</p>
    <div style="display: grid; gap: 12px; margin-top: 20px;">
      <Can permission="post:read">
        <div style="padding: 12px 16px; border-radius: 12px; background: #fff; border-left: 4px solid #22c55e; box-shadow: 0 8px 18px rgba(15, 23, 42, 0.08);">
          拥有 post:read 权限
        </div>
      </Can>
      <Can :permissions="['post:read', 'post:edit']" mode="all">
        <div style="padding: 12px 16px; border-radius: 12px; background: #fff; border-left: 4px solid #22c55e; box-shadow: 0 8px 18px rgba(15, 23, 42, 0.08);">
          拥有 post:read + post:edit
        </div>
      </Can>
      <Can role="admin">
        <div style="padding: 12px 16px; border-radius: 12px; background: #fff; border-left: 4px solid #22c55e; box-shadow: 0 8px 18px rgba(15, 23, 42, 0.08);">
          拥有 admin 角色
        </div>
      </Can>
      <Can :roles="['admin', 'ops']">
        <div style="padding: 12px 16px; border-radius: 12px; background: #fff; border-left: 4px solid #22c55e; box-shadow: 0 8px 18px rgba(15, 23, 42, 0.08);">
          拥有任意角色
        </div>
      </Can>
      <Can permission="system:deploy" not>
        <div style="padding: 12px 16px; border-radius: 12px; background: #fff; border-left: 4px solid #94a3b8; color: #64748b; box-shadow: 0 8px 18px rgba(15, 23, 42, 0.08);">
          没有 system:deploy 权限
        </div>
      </Can>
    </div>
  </section>
</template>
