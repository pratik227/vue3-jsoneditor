<script setup>
import { ref } from 'vue'
import Vue3Jsoneditor from 'v3-jsoneditor'

const json = ref({ order: 1042, items: [{ sku: 'A-1', qty: 2 }], paid: true })
const copied = ref(false)

function serialize(editor) {
  return JSON.stringify(editor.get(), null, 2)
}

async function copy(editor) {
  await navigator.clipboard.writeText(serialize(editor))
  copied.value = true
  setTimeout(() => (copied.value = false), 1500)
}

function download(editor) {
  const blob = new Blob([serialize(editor)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'data.json'
  a.click()
  URL.revokeObjectURL(url)
}
</script>

<template>
  <Vue3Jsoneditor v-model="json" theme="auto" height="300px">
    <template #toolbar="{ editor }">
      <button type="button" class="tb-btn" @click="copy(editor)">
        {{ copied ? 'Copied' : 'Copy JSON' }}
      </button>
      <button type="button" class="tb-btn" @click="download(editor)">Download</button>
    </template>
  </Vue3Jsoneditor>
</template>

<style scoped>
.tb-btn {
  margin-left: 6px;
  padding: 2px 10px;
  border: 1px solid currentColor;
  border-radius: 6px;
  background: transparent;
  color: inherit;
  font-size: 12px;
  cursor: pointer;
}
</style>
