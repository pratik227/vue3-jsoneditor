---
title: Form Mode
description: Let users edit values while keeping the JSON structure locked.
---

# Form Mode

`form` mode looks like `tree` mode, but users can only change values: they cannot add, remove, rename or reorder keys. It is a quick way to build a settings editor without writing a form by hand. Here the mode switcher is limited to `form` and `code` for power users.

<script setup>
import FormMode from './demos/FormMode.vue'
import formModeCode from './demos/FormMode.vue?raw'
</script>

<llm-exclude>

<DemoBlock title="Form mode" :code="formModeCode">
  <FormMode />
</DemoBlock>

</llm-exclude>

<llm-only>

```vue
<script setup>
import { ref } from 'vue'
import Vue3Jsoneditor from 'v3-jsoneditor'

const settings = ref({
  siteName: 'My Store',
  currency: 'EUR',
  maintenance: false,
  shipping: { freeAbove: 50, carriers: ['DHL', 'UPS'] },
})
</script>

<template>
  <Vue3Jsoneditor
    v-model="settings"
    current-mode="form"
    :mode-list="['form', 'code']"
    theme="auto"
    height="300px"
  />
  <p class="demo-note">maintenance: {{ settings.maintenance }}, currency: {{ settings.currency }}</p>
</template>

<style scoped>
.demo-note {
  font-size: 13px;
}
</style>
```

</llm-only>

## When to use form mode

- Editing configuration where the shape is fixed and only values should change.
- Letting non-technical users tweak data without breaking its structure.

Combine it with [JSON Schema validation](/examples/json-schema) to also constrain the values.
