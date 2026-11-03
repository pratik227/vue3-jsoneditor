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
