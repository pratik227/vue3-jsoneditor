<script setup lang="ts">
import { ref } from 'vue'
import { copyText } from '../utils/highlight'

const cmd = 'npm i v3-jsoneditor'
const copied = ref(false)
let t: ReturnType<typeof setTimeout> | undefined

async function copy() {
  if (await copyText(cmd)) {
    copied.value = true
    clearTimeout(t)
    t = setTimeout(() => (copied.value = false), 1600)
  }
}
</script>

<template>
  <div class="home-install">
    <code><span class="prompt" aria-hidden="true">$</span>{{ cmd }}</code>
    <button
      type="button"
      class="copy"
      :aria-label="copied ? 'Copied' : 'Copy install command'"
      :title="copied ? 'Copied' : 'Copy'"
      @click="copy"
    >
      <span :class="copied ? 'i-solar-copy-check-linear' : 'i-solar-copy-linear'" aria-hidden="true" />
    </button>
    <span class="sr-only" aria-live="polite">{{ copied ? 'Copied to clipboard' : '' }}</span>
  </div>
</template>

<style scoped>
.home-install code {
  padding: 0;
  font-size: inherit;
  color: inherit;
  background: none;
}
.home-install {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-top: 24px;
  padding: 4px 4px 4px 14px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 999px;
  background: var(--vp-c-bg);
  font-family: var(--vp-font-family-mono);
  font-size: 13.5px;
  color: var(--vp-c-text-1);
}
.prompt {
  margin-right: 10px;
  color: var(--vp-c-text-3);
  user-select: none;
}
.copy {
  display: grid;
  place-items: center;
  width: 30px;
  height: 30px;
  border-radius: 999px;
  color: var(--vp-c-text-2);
  transition: color 0.15s, background-color 0.15s;
}
.copy:hover {
  color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
}
.copy:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
}
.copy span {
  width: 16px;
  height: 16px;
}
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
}
</style>
