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

```vue
<template>
  <div v-if="$can?.('read', 'Post')">You can read posts.</div>
  <Can I="read" a="Post">Visible by <Can>.</Can>
</template>

<script setup lang="ts">
import { Can, useAbility } from '@icebreakers/ability'

const { can } = useAbility()
</script>
```

## API

- `abilitiesPlugin(app, ability, options)` registers the reactive ability instance.
- `useAbility()` injects the ability instance.
- `provideAbility(ability)` provides a scoped ability for a subtree.
- `Can` component renders based on `ability.can` result.
