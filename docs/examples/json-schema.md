---
title: JSON Schema Validation
description: Validate JSON against a schema and show the error count from validation-error.
---

# JSON Schema Validation

Pass a JSON Schema as `options.schema`. Invalid nodes are highlighted in the editor, and the `validation-error` event gives you the list of errors, here used to show a live status. Try fixing the email and age.

<script setup>
import JsonSchema from './demos/JsonSchema.vue'
import jsonSchemaCode from './demos/JsonSchema.vue?raw'
</script>

<llm-exclude>

<DemoBlock title="JSON Schema validation" :code="jsonSchemaCode">
  <JsonSchema />
</DemoBlock>

</llm-exclude>

<llm-only>

```vue
<script setup>
import { ref } from 'vue'
import Vue3Jsoneditor from 'v3-jsoneditor'

const json = ref({ name: 'Ada', email: 'not-an-email', age: -3 })
const errors = ref([])

const options = {
  schema: {
    type: 'object',
    required: ['name', 'email', 'age'],
    properties: {
      name: { type: 'string', minLength: 1 },
      email: { type: 'string', format: 'email' },
      age: { type: 'integer', minimum: 0 },
    },
    additionalProperties: false,
  },
}
</script>

<template>
  <Vue3Jsoneditor
    v-model="json"
    :options="options"
    current-mode="tree"
    theme="auto"
    height="300px"
    @validation-error="errors = $event"
  />
  <p class="demo-status" :class="{ ok: errors.length === 0 }">
    {{ errors.length === 0 ? 'Valid' : `${errors.length} validation error(s)` }}
  </p>
</template>

<style scoped>
.demo-status {
  font-size: 13px;
  color: #dc2626;
}
.demo-status.ok {
  color: #16a34a;
}
</style>
```

</llm-only>

## Notes

- `options.schema` is reactive: replace it and the editor revalidates without being re-created.
- Add custom rules with `options.onValidate`; its errors are included in `validation-error`.
- Parse errors (text that is not JSON at all) are reported through the `error` event instead.

Read more in the [Validation guide](/guide/validation).
