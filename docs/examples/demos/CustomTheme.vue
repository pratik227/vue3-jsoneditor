<script setup>
import { ref } from 'vue'
import Vue3Jsoneditor from 'v3-jsoneditor'

const json = ref({
  brand: 'Acme',
  palette: { primary: '#e11d48', surface: '#fff1f2' },
  features: ['fast', 'friendly'],
})
</script>

<template>
  <Vue3Jsoneditor
    v-model="json"
    class="brand-editor"
    current-mode="tree"
    theme="light"
    height="300px"
  />
</template>

<style>
.brand-editor.v3-jsoneditor {
  --vje-accent: #e11d48;
  --vje-bg: #ffffff;
  --vje-surface: #fff1f2;
  --vje-border: #fecdd3;
  --vje-text: #4c0519;
  --vje-muted: #9f1239;
  --vje-radius: 14px;
  --vje-shadow: 0 8px 24px rgba(225, 29, 72, 0.15);
}
</style>
