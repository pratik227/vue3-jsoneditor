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
