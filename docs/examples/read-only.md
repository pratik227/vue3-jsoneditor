---
title: Read-only Viewer
description: Display JSON as a collapsible, non-editable tree using view mode.
---

# Read-only Viewer

Use `view` mode to show JSON that users can browse, search and collapse but not change, such as an API response. Restricting `mode-list` to `['view']` ensures users cannot switch to an editable mode.

<script setup>
import ReadOnly from './demos/ReadOnly.vue'
import readOnlyCode from './demos/ReadOnly.vue?raw'
</script>

<llm-exclude>

<DemoBlock title="Read-only viewer" :code="readOnlyCode">
  <ReadOnly />
</DemoBlock>

</llm-exclude>

<llm-only>

```vue
<script setup>
import { ref } from 'vue'
import Vue3Jsoneditor from 'v3-jsoneditor'

const response = ref({
  status: 200,
  data: {
    users: [
      { id: 1, name: 'Ada', role: 'admin' },
      { id: 2, name: 'Linus', role: 'viewer' },
    ],
  },
  meta: { page: 1, total: 2 },
})
</script>

<template>
  <Vue3Jsoneditor
    v-model="response"
    current-mode="view"
    :mode-list="['view']"
    theme="auto"
    height="300px"
  />
</template>
```

</llm-only>

## The `read-only` prop

To make every mode read-only while still letting users switch between tree and code views, use the `read-only` prop instead:

```vue
<Vue3Jsoneditor v-model="response" read-only />
```

## Partially read-only

To lock only some fields while keeping others editable, use jsoneditor's `onEditable` option in `tree` mode. Return `false` to lock a node, or an object `{ field, value }` to control the key and value separately:

```vue
<script setup>
import { ref } from 'vue'
import Vue3Jsoneditor from 'v3-jsoneditor'

const json = ref({ id: 42, name: 'Ada', role: 'admin' })

const options = {
  onEditable({ path }) {
    // "id" is fully locked, other keys can't be renamed but values are editable
    if (path?.[0] === 'id') return false
    return { field: false, value: true }
  },
}
</script>

<template>
  <Vue3Jsoneditor v-model="json" :options="options" current-mode="tree" />
</template>
```

::: tip
In `code` and `text` modes, jsoneditor calls `onEditable` once with an empty node (no `path`). Returning `false` there makes the whole text read-only, which is why the example uses `path?.[0]`.
:::
