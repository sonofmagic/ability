<script setup lang="ts">
import { Can } from '~/index'
</script>

<template>
  <section style="padding: 32px; max-width: 720px; margin: 0 auto;">
    <h1>Ability Playground</h1>
    <p>Use <code>&lt;Can&gt;</code> with role/permission props.</p>
    <div style="display: grid; gap: 12px; margin-top: 20px;">
      <Can :p="['system:dept:add']">
        <div style="padding: 12px 16px; border-radius: 12px; background: #fff; border-left: 4px solid #22c55e; box-shadow: 0 8px 18px rgba(15, 23, 42, 0.08);">
          拥有 system:dept:add 权限
        </div>
      </Can>
      <Can :p="['system:dept:add', 'system:config:export']" mode="all">
        <div style="padding: 12px 16px; border-radius: 12px; background: #fff; border-left: 4px solid #22c55e; box-shadow: 0 8px 18px rgba(15, 23, 42, 0.08);">
          拥有 system:dept:add + system:config:export
        </div>
      </Can>
      <Can :r="['admin']">
        <div style="padding: 12px 16px; border-radius: 12px; background: #fff; border-left: 4px solid #22c55e; box-shadow: 0 8px 18px rgba(15, 23, 42, 0.08);">
          拥有 admin 角色
        </div>
      </Can>
      <Can :r="['admin', 'ops']">
        <div style="padding: 12px 16px; border-radius: 12px; background: #fff; border-left: 4px solid #22c55e; box-shadow: 0 8px 18px rgba(15, 23, 42, 0.08);">
          拥有任意角色
        </div>
      </Can>
      <Can :p="['system:user:remove']" not>
        <div style="padding: 12px 16px; border-radius: 12px; background: #fff; border-left: 4px solid #94a3b8; color: #64748b; box-shadow: 0 8px 18px rgba(15, 23, 42, 0.08);">
          没有 system:user:remove 权限
        </div>
      </Can>
    </div>
  </section>
</template>
