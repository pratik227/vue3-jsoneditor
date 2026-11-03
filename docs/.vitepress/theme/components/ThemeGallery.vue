<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import Vue3Jsoneditor from 'v3-jsoneditor'
import { copyText, highlight, plainHtml } from '../utils/highlight'

defineProps<{ /** Allow three columns on very wide screens (use on layout: page). */ wide?: boolean }>()

const sample = () => ({
  product: 'Mechanical keyboard',
  price: 129.9,
  inStock: true,
  tags: ['tactile', 'hot-swap'],
  specs: { layout: '75%', switches: 'brown' },
})

const galleries = [
  { theme: 'light', label: 'Light', json: ref(sample()) },
  { theme: 'dark', label: 'Dark', json: ref(sample()) },
  { theme: 'classic', label: 'Classic', json: ref(sample()) },
] as const

const defaults = {
  accent: '#7c3aed',
  bg: '#fdfcff',
  surface: '#f3f0ff',
  border: '#ddd6fe',
  text: '#1e1b4b',
  radius: 14,
}
const vars = reactive({ ...defaults })
const custom = ref(sample())

const fields = [
  { key: 'accent', label: 'Accent', css: '--vje-accent' },
  { key: 'bg', label: 'Background', css: '--vje-bg' },
  { key: 'surface', label: 'Surface', css: '--vje-surface' },
  { key: 'border', label: 'Border', css: '--vje-border' },
  { key: 'text', label: 'Text', css: '--vje-text' },
] as const

const style = computed(() => ({
  '--vje-accent': vars.accent,
  '--vje-bg': vars.bg,
  '--vje-surface': vars.surface,
  '--vje-border': vars.border,
  '--vje-text': vars.text,
  '--vje-radius': `${vars.radius}px`,
}))

const css = computed(
  () => `.my-editor.v3-jsoneditor {
  --vje-accent: ${vars.accent};
  --vje-bg: ${vars.bg};
  --vje-surface: ${vars.surface};
  --vje-border: ${vars.border};
  --vje-text: ${vars.text};
  --vje-radius: ${vars.radius}px;
}
`,
)

const cssHtml = ref(plainHtml(css.value))
watch(css, async (v) => (cssHtml.value = await highlight(v, 'css')), { immediate: typeof window !== 'undefined' })

const copied = ref(false)
let t: ReturnType<typeof setTimeout> | undefined
async function copy() {
  if (await copyText(css.value)) {
    copied.value = true
    clearTimeout(t)
    t = setTimeout(() => (copied.value = false), 1600)
  }
}
function reset() {
  Object.assign(vars, defaults)
}
</script>

<template>
  <div class="theme-gallery" :class="{ 'is-wide': wide }">
    <div class="tg-grid">
      <figure v-for="g in galleries" :key="g.theme" class="tg-item">
        <figcaption>
          <span class="dot" :class="g.theme" aria-hidden="true" />
          {{ g.label }} <code>theme="{{ g.theme }}"</code>
        </figcaption>
        <ClientOnly>
          <Vue3Jsoneditor v-model="g.json.value" :theme="g.theme" current-mode="tree" :mode-list="['tree', 'code']" height="240px" />
        </ClientOnly>
      </figure>
    </div>

    <div class="tg-tweaker">
      <div class="tg-controls" role="group" aria-label="CSS variables">
        <div class="tg-head">
          <h4><span class="i-solar-pallete-2-bold-duotone" aria-hidden="true" /> CSS variables</h4>
          <button type="button" class="docs-btn" @click="reset">Reset</button>
        </div>
        <label v-for="f in fields" :key="f.key" class="color-field">
          <input v-model="vars[f.key]" type="color" />
          <span class="name">{{ f.label }}</span>
          <code>{{ f.css }}</code>
        </label>
        <label class="range-field">
          <span class="name">Radius <output>{{ vars.radius }}px</output></span>
          <input v-model.number="vars.radius" type="range" min="0" max="24" />
        </label>
      </div>

      <div class="tg-preview" :style="style">
        <ClientOnly>
          <Vue3Jsoneditor v-model="custom" class="my-editor" theme="light" current-mode="tree" height="320px" />
        </ClientOnly>
      </div>
    </div>

    <div class="tg-css">
      <div class="tg-css-bar">
        <span>Generated CSS</span>
        <button type="button" class="docs-btn" @click="copy">
          <span :class="copied ? 'i-solar-copy-check-linear' : 'i-solar-copy-linear'" aria-hidden="true" />
          {{ copied ? 'Copied' : 'Copy CSS' }}
        </button>
      </div>
      <div class="docs-code" v-html="cssHtml" />
    </div>
  </div>
</template>

<style scoped>
.theme-gallery {
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin: 24px 0;
}
.tg-grid {
  display: grid;
  /* The doc column is ~690px: three editors side by side would be too cramped there,
     so they only sit side by side on very wide layouts (e.g. layout: page). */
  grid-template-columns: 1fr;
  gap: 20px;
}
@media (min-width: 1500px) {
  .theme-gallery.is-wide .tg-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
.tg-item {
  margin: 0;
  min-width: 0;
}
figcaption {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 600;
}
figcaption code {
  font-size: 12px;
  font-weight: 400;
}
.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 1px solid var(--vp-c-divider);
}
.dot.light {
  background: #fff;
}
.dot.dark {
  background: #1f2430;
}
.dot.classic {
  background: #3883fa;
}
.tg-tweaker {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}
@media (min-width: 760px) {
  .tg-tweaker {
    grid-template-columns: 250px minmax(0, 1fr);
  }
}
.tg-controls {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 16px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
}
.tg-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
}
.tg-head h4 {
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 0;
  font-size: 14px;
}
.tg-head h4 span {
  color: var(--vp-c-brand-1);
}
.color-field {
  display: grid;
  grid-template-columns: 28px 1fr auto;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  cursor: pointer;
}
.color-field input {
  width: 28px;
  height: 28px;
  padding: 0;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: none;
  cursor: pointer;
}
.color-field input::-webkit-color-swatch-wrapper {
  padding: 2px;
}
.color-field input::-webkit-color-swatch {
  border: 0;
  border-radius: 5px;
}
.color-field code {
  font-size: 11px;
}
.range-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 13px;
}
.range-field .name {
  display: flex;
  justify-content: space-between;
}
.range-field output {
  font-family: var(--vp-font-family-mono);
  color: var(--vp-c-brand-1);
}
.range-field input {
  accent-color: var(--vp-c-brand-3);
}
.color-field input:focus-visible,
.range-field input:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 2px;
}
.tg-preview {
  min-width: 0;
}
.tg-css {
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  overflow: hidden;
}
.tg-css-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  font-size: 13px;
  font-weight: 600;
  color: var(--vp-c-text-2);
  border-bottom: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
}
</style>
