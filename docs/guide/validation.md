---
title: Validation
description: Validate JSON with a JSON Schema via options.schema, add custom validation with onValidate, and react to validation-error and parse error events.
---

# Validation

jsoneditor has built-in validation powered by [Ajv](https://ajv.js.org/). v3-jsoneditor exposes it through `options` and adds events so your app can react to problems.

## JSON Schema

Pass a [JSON Schema](https://json-schema.org/) as `options.schema`. Invalid values are highlighted in the editor and listed at the bottom.

```vue
<script setup>
import { ref } from 'vue'
import Vue3Jsoneditor from 'v3-jsoneditor'

const json = ref({ name: 'Ada', age: -3 })

const options = {
  schema: {
    type: 'object',
    required: ['name', 'age'],
    properties: {
      name: { type: 'string', minLength: 1 },
      age: { type: 'integer', minimum: 0 },
    },
    additionalProperties: false,
  },
}
</script>

<template>
  <Vue3Jsoneditor v-model="json" :options="options" current-mode="tree" height="320px" />
</template>
```

Use `options.schemaRefs` to provide referenced sub-schemas (`$ref`).

### Reactive schema

The schema is reactive: when `options.schema` changes, the component calls jsoneditor's `setSchema()` without re-creating the editor.

```vue
<script setup>
import { ref, computed } from 'vue'
import Vue3Jsoneditor from 'v3-jsoneditor'

const strict = ref(false)
const json = ref({ name: 'Ada', extra: true })

const options = computed(() => ({
  schema: {
    type: 'object',
    properties: { name: { type: 'string' } },
    additionalProperties: !strict.value,
  },
}))
</script>

<template>
  <label><input v-model="strict" type="checkbox" /> Strict mode</label>
  <Vue3Jsoneditor v-model="json" :options="options" height="260px" />
</template>
```

## Custom validation

For rules that JSON Schema cannot express, use jsoneditor's `onValidate`. It receives the JSON and returns an array of errors (or a Promise of one). Each error has a `path` and a `message`.

```js
const options = {
  onValidate(json) {
    const errors = []
    if (json?.team && !json.team.includes(json.owner)) {
      errors.push({ path: ['owner'], message: 'Owner must be a team member' })
    }
    return errors
  },
}
```

`onValidate` runs in addition to `schema` validation.

## Reacting to errors

### `validation-error`

Emitted with the array of validation errors (schema and custom) whenever validation runs. An empty array means the document is valid.

```vue
<script setup>
import { ref } from 'vue'
import Vue3Jsoneditor from 'v3-jsoneditor'

const json = ref({ age: 'ten' })
const errors = ref([])
const options = { schema: { type: 'object', properties: { age: { type: 'number' } } } }
</script>

<template>
  <Vue3Jsoneditor
    v-model="json"
    :options="options"
    @validation-error="errors = $event"
  />
  <button :disabled="errors.length > 0">Save</button>
</template>
```

### `error`

Emitted when the text in `code` or `text` mode is not valid JSON (a parse error). The model keeps its last valid value until the text parses again.

```vue
<Vue3Jsoneditor v-model="json" @error="(err) => (parseError = err.message)" />
```

::: tip
Use `error` for "the text is not JSON at all" and `validation-error` for "the JSON is well-formed but breaks the rules".
:::

See the [JSON Schema example](/examples/json-schema) for a live demo.
