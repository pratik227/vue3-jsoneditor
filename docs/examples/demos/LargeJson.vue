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
