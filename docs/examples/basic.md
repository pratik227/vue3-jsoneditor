---
title: Basic Usage
description: A minimal two-way bound JSON editor with v-model in tree mode.
---

# Basic Usage

The smallest useful setup: bind a reactive object with `v-model`, start in `tree` mode and give the editor a height. Edit any value and the bound object below updates instantly.

<script setup>
import Basic from './demos/Basic.vue'
import basicCode from './demos/Basic.vue?raw'
</script>

<llm-exclude>

<DemoBlock title="Basic usage" :code="basicCode">
  <Basic />
</DemoBlock>

</llm-exclude>

<llm-only>

```vue
<script setup>
import { ref } from 'vue'
import Vue3Jsoneditor from 'v3-jsoneditor'

const json = ref({
  id: 1,
  title: 'Hello v3-jsoneditor',
  published: true,
  tags: ['vue', 'json', 'editor'],
  author: { name: 'Ada Lovelace', email: 'ada@example.com' },
})
</script>

<template>
  <Vue3Jsoneditor v-model="json" current-mode="tree" theme="auto" height="320px" />
  <pre class="demo-output">{{ json }}</pre>
</template>

<style scoped>
.demo-output {
  margin-top: 12px;
  max-height: 160px;
  overflow: auto;
  font-size: 12px;
}
</style>
```

</llm-only>

## How it works

- `v-model` keeps `json` and the editor in sync in both directions.
- `current-mode="tree"` starts in the tree view; the user can still switch modes from the menu.
- `theme="auto"` follows the site's dark mode.

Next: [Read-only viewer](/examples/read-only) or the [Usage guide](/guide/usage).
