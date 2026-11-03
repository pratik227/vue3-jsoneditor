<script setup lang="ts">
import { ref, watch, useId } from 'vue'
import { copyText, highlight, plainHtml } from '../utils/highlight'

const props = withDefaults(
  defineProps<{
    title?: string
    code: string
    lang?: string
  }>(),
  { lang: 'vue' },
)

const showCode = ref(false)
const copied = ref(false)
const html = ref(plainHtml(props.code))
const codeId = `demo-code-${useId()}`
let highlighted = false
let timer: ReturnType<typeof setTimeout> | undefined

async function render() {
  html.value = await highlight(props.code.trim(), props.lang)
  highlighted = true
}

watch(showCode, (open) => {
  if (open && !highlighted) render()
})
watch(
  () => props.code,
  () => {
    highlighted = false
    html.value = plainHtml(props.code)
    if (showCode.value) render()
  },
)

async function copy() {
  if (await copyText(props.code.trim())) {
    copied.value = true
    clearTimeout(timer)
    timer = setTimeout(() => (copied.value = false), 1600)
  }
}
</script>

<template>
  <div class="demo-block">
    <div class="demo-preview">
      <ClientOnly>
        <slot />
      </ClientOnly>
    </div>
    <div class="demo-toolbar">
      <span v-if="title" class="demo-title">{{ title }}</span>
      <div class="demo-actions">
        <button
          type="button"
          class="docs-btn"
          :aria-expanded="showCode"
          :aria-controls="codeId"
          @click="showCode = !showCode"
        >
          <span class="i-solar-code-square-bold-duotone" aria-hidden="true" />
          {{ showCode ? 'Hide code' : 'Show code' }}
        </button>
        <button
          type="button"
          class="docs-btn"
          :aria-label="copied ? 'Code copied' : 'Copy code'"
          :title="copied ? 'Copied' : 'Copy code'"
          @click="copy"
        >
          <span :class="copied ? 'i-solar-copy-check-linear' : 'i-solar-copy-linear'" aria-hidden="true" />
          {{ copied ? 'Copied' : 'Copy' }}
        </button>
      </div>
    </div>
    <div v-show="showCode" :id="codeId" class="demo-code docs-code" v-html="html" />
  </div>
</template>

<style scoped>
.demo-block {
  margin: 20px 0;
  border: 1px solid var(--vp-c-divider);
  border-radius: 16px;
  background: var(--vp-c-bg);
  overflow: hidden;
}
.demo-preview {
  padding: 20px;
  min-height: 80px;
}
.demo-toolbar {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  border-top: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
}
.demo-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--vp-c-text-2);
}
.demo-actions {
  display: flex;
  gap: 8px;
  margin-left: auto;
}
.demo-code {
  border-top: 1px solid var(--vp-c-divider);
  max-height: 520px;
}
</style>
