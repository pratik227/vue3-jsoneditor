---
title: Large JSON
description: Handle thousands of records smoothly with code mode and shallowRef.
---

# Large JSON

This demo loads an array of 5,000 objects. jsoneditor handles large documents well when a few precautions are followed.

<script setup>
import LargeJson from './demos/LargeJson.vue'
import largeJsonCode from './demos/LargeJson.vue?raw'
</script>

<llm-exclude>

<DemoBlock title="Large JSON (5,000 items)" :code="largeJsonCode">
  <LargeJson />
</DemoBlock>

</llm-exclude>

<llm-only>

```vue
<script setup>
import { shallowRef } from 'vue'
import Vue3Jsoneditor from 'v3-jsoneditor'

function generate(count) {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `Item ${i + 1}`,
    price: Math.round(Math.random() * 10000) / 100,
    inStock: i % 3 !== 0,
    tags: ['alpha', 'beta', 'gamma'].slice(0, (i % 3) + 1),
  }))
}

// shallowRef: Vue tracks only .value, not every nested item
const json = shallowRef(generate(5000))

function regenerate() {
  json.value = generate(5000)
}
</script>

<template>
  <button class="demo-btn" type="button" @click="regenerate">Regenerate 5,000 items</button>
  <Vue3Jsoneditor v-model="json" current-mode="code" :debounce="200" theme="auto" height="400px" />
</template>

<style scoped>
.demo-btn {
  margin-bottom: 12px;
  padding: 4px 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  font-size: 13px;
}
</style>
```

</llm-only>

## Performance tips

- **Start in `code` mode.** The Ace-based code editor virtualizes rendering; `tree` mode creates DOM nodes for every visible entry and is slower to open for big documents. Users can still switch to `tree`.
- **Use `shallowRef` instead of `ref`.** A deep `ref` makes Vue wrap every nested object in a reactive proxy, which costs memory and time on every update. With `shallowRef` only `.value` is tracked; replace the whole value to update.
- **Debounce updates** with `:debounce="200"` (150 to 300 ms works well) so `v-model` is not re-parsed on every keystroke.
- **Avoid deep watchers** on the bound value; listen to `@change` instead.
- **Disable features you do not need** in `options`, for example `{ enableSort: false, enableTransform: false, search: false }`.
- **Reserve the height** with the `height` prop so the page does not jump while the editor loads.

::: warning
In `tree` mode jsoneditor shows large arrays in pages ("show more"), but auto-expansion on update still has a cost. If you need `tree` mode for very large data, call `collapseAll()` through a template ref after loading.
:::
