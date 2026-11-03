<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import Vue3Jsoneditor from 'v3-jsoneditor'
import { copyText, highlight, plainHtml } from '../utils/highlight'

type Mode = 'tree' | 'code' | 'form' | 'text' | 'view'
type Theme = 'light' | 'dark' | 'auto' | 'classic'

const ALL_MODES: Mode[] = ['tree', 'code', 'form', 'text', 'view']
const THEMES: Theme[] = ['light', 'dark', 'auto', 'classic']
const LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'zh-CN', label: '简体中文' },
  { value: 'pt-BR', label: 'Português (BR)' },
  { value: 'tr', label: 'Türkçe' },
  { value: 'ja', label: '日本語' },
  { value: 'fr-FR', label: 'Français' },
  { value: 'de', label: 'Deutsch' },
  { value: 'ru', label: 'Русский' },
  { value: 'es', label: 'Español' },
]

const json = ref<unknown>({
  id: 42,
  name: 'Ada Lovelace',
  email: 'ada@example.com',
  active: true,
  roles: ['admin', 'editor'],
  address: { city: 'London', country: 'UK' },
  lastLogin: null,
})

const currentMode = ref<Mode>('tree')
const modeList = ref<Mode[]>([...ALL_MODES])
const theme = ref<Theme>('auto')
const height = ref(420)
const language = ref('en')
const plus = ref(true)
const fullscreen = ref(false)
const readOnly = ref(false)
const mainMenuBar = ref(true)
const navigationBar = ref(true)
const statusBar = ref(true)
const indentation = ref(2)

// jsoneditor reads language / modes only at construction; remount when they change.
const editorKey = computed(
  () =>
    `${language.value}|${modeList.value.join(',')}|${readOnly.value}|${mainMenuBar.value}|${navigationBar.value}|${statusBar.value}|${indentation.value}`,
)

const switches = [
  { prop: 'plus', label: 'Fullscreen button', model: plus },
  { prop: 'readOnly', label: 'Read-only', model: readOnly },
  { prop: 'mainMenuBar', label: 'Menu bar', model: mainMenuBar },
  { prop: 'navigationBar', label: 'Navigation bar', model: navigationBar },
  { prop: 'statusBar', label: 'Status bar', model: statusBar },
]

function toggleMode(m: Mode) {
  const has = modeList.value.includes(m)
  if (has && modeList.value.length === 1) return
  modeList.value = has ? modeList.value.filter((x) => x !== m) : ALL_MODES.filter((x) => x === m || modeList.value.includes(x))
  if (!modeList.value.includes(currentMode.value)) currentMode.value = modeList.value[0]
}

/* ---------------- event log ---------------- */
interface LogEntry {
  id: number
  time: string
  name: string
  detail: string
}
const log = ref<LogEntry[]>([])
let seq = 0

function summarize(v: unknown, depth = 0): string {
  if (v === null || v === undefined) return String(v)
  if (typeof v === 'string') return JSON.stringify(v.length > 60 ? `${v.slice(0, 60)}…` : v)
  if (typeof v === 'number' || typeof v === 'boolean') return String(v)
  if (typeof v === 'function') return 'ƒ()'
  if (v instanceof Error) return `${v.name}: ${v.message}`
  if (typeof Element !== 'undefined' && v instanceof Element) return `<${v.tagName.toLowerCase()}>`
  if (Array.isArray(v)) return depth > 0 ? `Array(${v.length})` : `[${v.slice(0, 5).map((x) => summarize(x, depth + 1)).join(', ')}${v.length > 5 ? ', …' : ''}]`
  const ctor = (v as object).constructor?.name
  if (ctor && ctor !== 'Object') return ctor
  if (depth > 0) return '{…}'
  try {
    const s = JSON.stringify(v)
    return s.length > 90 ? `${s.slice(0, 90)}…` : s
  } catch {
    return '{…}'
  }
}

function record(name: string, ...args: unknown[]) {
  const d = new Date()
  const time = `${d.toTimeString().slice(0, 8)}.${String(d.getMilliseconds()).padStart(3, '0')}`
  log.value.unshift({ id: ++seq, time, name, detail: args.map((a) => summarize(a)).join(', ') })
  if (log.value.length > 50) log.value.length = 50
}

/* ---------------- generated SFC ---------------- */
const sfc = computed(() => {
  const attrs: string[] = ['v-model="json"', 'v-model:currentMode="mode"', 'v-model:fullscreen="fullscreen"']
  if (modeList.value.length !== ALL_MODES.length)
    attrs.push(`:mode-list="[${modeList.value.map((m) => `'${m}'`).join(', ')}]"`)
  if (theme.value !== 'light') attrs.push(`theme="${theme.value}"`)
  if (language.value !== 'en') attrs.push(`language="${language.value}"`)
  attrs.push(`height="${height.value}px"`)
  if (!plus.value) attrs.push(':plus="false"')
  if (readOnly.value) attrs.push('read-only')
  if (!mainMenuBar.value) attrs.push(':main-menu-bar="false"')
  if (!navigationBar.value) attrs.push(':navigation-bar="false"')
  if (!statusBar.value) attrs.push(':status-bar="false"')
  if (indentation.value !== 2) attrs.push(`:indentation="${indentation.value}"`)

  const data = JSON.stringify(json.value ?? {}, null, 2)
    .split('\n')
    .map((l, i) => (i === 0 ? l : `  ${l}`))
    .join('\n')

  return `<script setup>
import { ref } from 'vue'
import Vue3Jsoneditor from 'v3-jsoneditor'

const json = ref(${data})
const mode = ref('${currentMode.value}')
const fullscreen = ref(false)
const readOnly = ref(false)
const mainMenuBar = ref(true)
const navigationBar = ref(true)
const statusBar = ref(true)
const indentation = ref(2)
<\/script>

<template>
  <Vue3Jsoneditor
    ${attrs.join('\n    ')}
  />
</template>
`
})

/* ---------------- tabs ---------------- */
const tabs = [
  { id: 'code', label: 'Code', icon: 'i-solar-code-square-bold-duotone' },
  { id: 'model', label: 'Model', icon: 'i-solar-document-text-linear' },
  { id: 'events', label: 'Events', icon: 'i-solar-history-bold-duotone' },
] as const
const tab = ref<(typeof tabs)[number]['id']>('code')

const modelText = computed(() => JSON.stringify(json.value, null, 2) ?? 'undefined')
const codeHtml = ref(plainHtml(sfc.value))
const modelHtml = ref(plainHtml(modelText.value))

let raf = 0
watch(
  [sfc, modelText, tab],
  () => {
    cancelAnimationFrame(raf)
    raf = requestAnimationFrame(async () => {
      if (tab.value === 'code') codeHtml.value = await highlight(sfc.value, 'vue')
      if (tab.value === 'model') modelHtml.value = await highlight(modelText.value, 'json')
    })
  },
  { immediate: typeof window !== 'undefined' },
)

const copied = ref(false)
let copyTimer: ReturnType<typeof setTimeout> | undefined
async function copyCurrent() {
  const text = tab.value === 'model' ? modelText.value : sfc.value
  if (await copyText(text)) {
    copied.value = true
    clearTimeout(copyTimer)
    copyTimer = setTimeout(() => (copied.value = false), 1600)
  }
}

function onTabKey(e: KeyboardEvent, index: number) {
  const dir = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0
  if (!dir) return
  e.preventDefault()
  const next = tabs[(index + dir + tabs.length) % tabs.length]
  tab.value = next.id
  ;(document.getElementById(`pg-tab-${next.id}`) as HTMLElement | null)?.focus()
}
</script>

<template>
  <div class="playground">
    <div class="pg-main">
      <aside class="pg-controls" aria-label="Editor options">
        <div class="field">
          <label for="pg-mode">Current mode</label>
          <select id="pg-mode" v-model="currentMode">
            <option v-for="m in modeList" :key="m" :value="m">{{ m }}</option>
          </select>
        </div>

        <fieldset class="field">
          <legend>Mode list</legend>
          <div class="chips">
            <button
              v-for="m in ALL_MODES"
              :key="m"
              type="button"
              class="chip"
              :aria-pressed="modeList.includes(m)"
              @click="toggleMode(m)"
            >
              {{ m }}
            </button>
          </div>
        </fieldset>

        <div class="field">
          <label for="pg-theme">Theme</label>
          <select id="pg-theme" v-model="theme">
            <option v-for="t in THEMES" :key="t" :value="t">{{ t }}</option>
          </select>
        </div>

        <div class="field">
          <label for="pg-height">Height <output>{{ height }}px</output></label>
          <input id="pg-height" v-model.number="height" type="range" min="240" max="720" step="20" />
        </div>

        <div class="field">
          <label for="pg-lang">Language</label>
          <select id="pg-lang" v-model="language">
            <option v-for="l in LANGUAGES" :key="l.value" :value="l.value">{{ l.label }} ({{ l.value }})</option>
          </select>
        </div>

        <div class="field">
          <label for="pg-indent">Indentation <output>{{ indentation }}</output></label>
          <input id="pg-indent" v-model.number="indentation" type="range" min="1" max="8" step="1" />
        </div>

        <label v-for="sw in switches" :key="sw.prop" class="switch">
          <input v-model="sw.model.value" type="checkbox" />
          <span class="track" aria-hidden="true"><span class="thumb" /></span>
          {{ sw.label }} <code>{{ sw.prop }}</code>
        </label>

        <button type="button" class="docs-btn pg-fs" @click="fullscreen = true">
          <span class="i-solar-maximize-square-bold-duotone" aria-hidden="true" />
          Open fullscreen
        </button>
      </aside>

      <div class="pg-editor">
        <ClientOnly>
          <Vue3Jsoneditor
            :key="editorKey"
            v-model="json"
            v-model:currentMode="currentMode"
            v-model:fullscreen="fullscreen"
            :mode-list="modeList"
            :theme="theme"
            :language="language"
            :height="height"
            :plus="plus"
            :read-only="readOnly"
            :main-menu-bar="mainMenuBar"
            :navigation-bar="navigationBar"
            :status-bar="statusBar"
            :indentation="indentation"
            @change="(v: unknown) => record('change', v)"
            @error="(e: unknown) => record('error', e)"
            @validation-error="(e: unknown) => record('validation-error', e)"
            @mode-change="(n: unknown, o: unknown) => record('mode-change', n, o)"
            @fullscreen-change="(v: unknown) => record('fullscreen-change', v)"
            @focus="(...a: unknown[]) => record('focus', ...a)"
            @blur="(...a: unknown[]) => record('blur', ...a)"
            @text-selection-change="(...a: unknown[]) => record('textSelectionChange', ...a)"
            @selection-change="(...a: unknown[]) => record('selectionChange', ...a)"
          />
        </ClientOnly>
      </div>
    </div>

    <div class="pg-panel">
      <div class="pg-tabs">
        <div role="tablist" aria-label="Output">
          <button
            v-for="(t, i) in tabs"
            :id="`pg-tab-${t.id}`"
            :key="t.id"
            type="button"
            role="tab"
            class="pg-tab"
            :aria-selected="tab === t.id"
            :aria-controls="`pg-panel-${t.id}`"
            :tabindex="tab === t.id ? 0 : -1"
            @click="tab = t.id"
            @keydown="onTabKey($event, i)"
          >
            <span :class="t.icon" aria-hidden="true" />
            {{ t.label }}
            <span v-if="t.id === 'events' && log.length" class="badge">{{ log.length }}</span>
          </button>
        </div>
        <div class="pg-tab-actions">
          <button v-if="tab !== 'events'" type="button" class="docs-btn" @click="copyCurrent">
            <span :class="copied ? 'i-solar-copy-check-linear' : 'i-solar-copy-linear'" aria-hidden="true" />
            {{ copied ? 'Copied' : 'Copy' }}
          </button>
          <button v-else type="button" class="docs-btn" :disabled="!log.length" @click="log = []">
            <span class="i-solar-trash-bin-minimalistic-linear" aria-hidden="true" />
            Clear
          </button>
        </div>
      </div>

      <div v-show="tab === 'code'" id="pg-panel-code" role="tabpanel" aria-labelledby="pg-tab-code" class="docs-code pg-out" v-html="codeHtml" />
      <div v-show="tab === 'model'" id="pg-panel-model" role="tabpanel" aria-labelledby="pg-tab-model" class="docs-code pg-out" v-html="modelHtml" />
      <div v-show="tab === 'events'" id="pg-panel-events" role="tabpanel" aria-labelledby="pg-tab-events" class="pg-out pg-log">
        <p v-if="!log.length" class="empty">Interact with the editor — events will appear here (latest first, max 50).</p>
        <ol v-else>
          <li v-for="e in log" :key="e.id">
            <time>{{ e.time }}</time>
            <span class="ev">{{ e.name }}</span>
            <span class="detail">{{ e.detail }}</span>
          </li>
        </ol>
      </div>
    </div>
  </div>
</template>

<style scoped>
.playground {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin: 8px 0 40px;
}
.pg-main {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
}
@media (min-width: 900px) {
  .pg-main {
    grid-template-columns: 260px minmax(0, 1fr);
  }
}
.pg-controls {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 18px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 18px;
  background: var(--vp-c-bg-soft);
  align-self: start;
}
.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin: 0;
  padding: 0;
  border: 0;
  min-width: 0;
}
.field label,
.field legend {
  display: flex;
  justify-content: space-between;
  padding: 0;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--vp-c-text-2);
}
.field output {
  font-family: var(--vp-font-family-mono);
  text-transform: none;
  color: var(--vp-c-brand-1);
}
select {
  height: 34px;
  padding: 0 10px;
  font-size: 14px;
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  appearance: auto;
}
select:focus-visible,
input:focus-visible,
.chip:focus-visible,
.pg-tab:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 2px;
}
input[type='range'] {
  accent-color: var(--vp-c-brand-3);
}
.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.chip {
  padding: 3px 10px;
  font-family: var(--vp-font-family-mono);
  font-size: 12px;
  color: var(--vp-c-text-2);
  border: 1px solid var(--vp-c-divider);
  border-radius: 999px;
  background: var(--vp-c-bg);
  transition: all 0.15s;
}
.chip[aria-pressed='true'] {
  color: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-2);
  background: var(--vp-c-brand-soft);
}
.switch code {
  margin-left: auto;
  font-size: 11px;
}
.switch {
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  color: var(--vp-c-text-1);
  cursor: pointer;
}
.switch input {
  position: absolute;
  opacity: 0;
  width: 36px;
  height: 20px;
  margin: 0;
}
.track {
  position: relative;
  flex-shrink: 0;
  width: 36px;
  height: 20px;
  border-radius: 999px;
  background: var(--vp-c-divider);
  transition: background-color 0.2s;
}
.thumb {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.25);
  transition: transform 0.2s;
}
.switch input:checked + .track {
  background: var(--vp-c-brand-3);
}
.switch input:checked + .track .thumb {
  transform: translateX(16px);
  background: var(--docs-ink-contrast);
}
.switch input:focus-visible + .track {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 2px;
}
.pg-fs {
  justify-content: center;
  height: 36px;
}
.pg-editor {
  min-width: 0;
}

.pg-panel {
  border: 1px solid var(--vp-c-divider);
  border-radius: 18px;
  overflow: hidden;
  background: var(--vp-c-bg);
}
.pg-tabs {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 10px;
  border-bottom: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
}
.pg-tabs [role='tablist'] {
  display: flex;
}
.pg-tab {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 12px 12px 10px;
  font-size: 13px;
  font-weight: 500;
  color: var(--vp-c-text-2);
  border-bottom: 2px solid transparent;
}
.pg-tab[aria-selected='true'] {
  color: var(--vp-c-brand-1);
  border-bottom-color: var(--vp-c-brand-3);
}
.pg-tab span[class^='i-solar'] {
  width: 15px;
  height: 15px;
}
.badge {
  padding: 0 6px;
  font-size: 11px;
  line-height: 18px;
  border-radius: 999px;
  color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
}
.pg-tab-actions {
  margin-left: auto;
}
.pg-out {
  height: 360px;
  overflow: auto;
}
.pg-log {
  font-family: var(--vp-font-family-mono);
  font-size: 12.5px;
}
.pg-log .empty {
  margin: 0;
  padding: 20px;
  color: var(--vp-c-text-3);
  font-family: var(--vp-font-family-base);
  font-size: 14px;
}
.pg-log ol {
  list-style: none;
  margin: 0;
  padding: 6px 0;
}
.pg-log li {
  display: flex;
  gap: 12px;
  padding: 5px 16px;
  border-bottom: 1px dashed var(--vp-c-divider);
  white-space: nowrap;
}
.pg-log time {
  color: var(--vp-c-text-3);
}
.pg-log .ev {
  min-width: 140px;
  color: var(--vp-c-brand-1);
  font-weight: 600;
}
.pg-log .detail {
  overflow: hidden;
  text-overflow: ellipsis;
  color: var(--vp-c-text-2);
}
</style>
