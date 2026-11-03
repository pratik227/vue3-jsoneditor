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
