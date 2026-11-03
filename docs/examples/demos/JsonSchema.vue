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
