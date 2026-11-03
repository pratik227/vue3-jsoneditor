<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { useData, withBase } from 'vitepress'
import { copyText } from '../utils/highlight'

const SITE = 'https://v3-jsoneditor.netlify.app'
const { page, frontmatter } = useData()

const visible = computed(() => frontmatter.value.layout !== 'home' && frontmatter.value.pageActions !== false)
// vitepress-plugin-llms writes `foo/index.md` as `/foo.md`.
const mdFile = computed(() => page.value.relativePath.replace(/\/index\.md$/, '.md'))
const mdPath = computed(() => withBase(`/${mdFile.value}`))
const mdAbsolute = computed(() => `${SITE}/${mdFile.value}`)
const prompt = computed(
  () =>
    `Read ${mdAbsolute.value} and help me use v3-jsoneditor (Vue 3 JSON editor component). Full docs: ${SITE}/llms-full.txt`,
)

interface Provider {
  name: string
  icon: string
  /** Prefill URL. When absent, the prompt is copied and the base URL opened. */
  prefill?: string
  url?: string
}
const providers: Provider[] = [
  { name: 'ChatGPT', icon: 'i-solar-chat-round-bold-duotone', prefill: 'https://chatgpt.com/?q=' },
  { name: 'Claude', icon: 'i-solar-stars-bold-duotone', prefill: 'https://claude.ai/new?q=' },
  { name: 'Grok', icon: 'i-solar-bolt-bold-duotone', prefill: 'https://grok.com/?q=' },
  { name: 'Perplexity', icon: 'i-solar-magic-stick-3-bold-duotone', prefill: 'https://www.perplexity.ai/search?q=' },
  { name: 'DeepSeek', icon: 'i-solar-cpu-bolt-bold-duotone', url: 'https://chat.deepseek.com' },
  { name: 'Gemini', icon: 'i-solar-chat-square-code-bold-duotone', url: 'https://gemini.google.com/app' },
]

/* ---------- toast ---------- */
const toast = ref('')
let toastTimer: ReturnType<typeof setTimeout> | undefined
function notify(msg: string) {
  toast.value = msg
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => (toast.value = ''), 2400)
}

/* ---------- copy page ---------- */
const copying = ref(false)
const copiedPage = ref(false)
async function copyPage() {
  copying.value = true
  let text = ''
  try {
    const res = await fetch(mdPath.value, { headers: { Accept: 'text/markdown, text/plain' } })
    const type = res.headers.get('content-type') || ''
    if (res.ok && !type.includes('text/html')) text = await res.text()
  } catch {
    /* fall through to DOM text */
  }
  if (!text) text = (document.querySelector('.vp-doc') as HTMLElement | null)?.innerText ?? ''
  copying.value = false
  if (text && (await copyText(text))) {
    copiedPage.value = true
    notify('Page copied as Markdown')
    setTimeout(() => (copiedPage.value = false), 1600)
  } else {
    notify('Could not copy this page')
  }
}

/* ---------- Ask AI menu ---------- */
const open = ref(false)
const root = ref<HTMLElement>()
const trigger = ref<HTMLButtonElement>()
const menu = ref<HTMLElement>()

function items() {
  return Array.from(menu.value?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? [])
}
async function openMenu(focus: 'first' | 'last' = 'first') {
  open.value = true
  await nextTick()
  const list = items()
  ;(focus === 'first' ? list[0] : list[list.length - 1])?.focus()
}
function closeMenu(returnFocus = true) {
  open.value = false
  if (returnFocus) trigger.value?.focus()
}
function onTriggerKey(e: KeyboardEvent) {
  if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
    e.preventDefault()
    openMenu('first')
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    openMenu('last')
  }
}
function onMenuKey(e: KeyboardEvent) {
  const list = items()
  const idx = list.indexOf(document.activeElement as HTMLElement)
  if (e.key === 'Escape') {
    e.preventDefault()
    closeMenu()
  } else if (e.key === 'ArrowDown') {
    e.preventDefault()
    list[(idx + 1) % list.length]?.focus()
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    list[(idx - 1 + list.length) % list.length]?.focus()
  } else if (e.key === 'Home') {
    e.preventDefault()
    list[0]?.focus()
  } else if (e.key === 'End') {
    e.preventDefault()
    list[list.length - 1]?.focus()
  } else if (e.key === 'Tab') {
    closeMenu(false)
  }
}
function onDocClick(e: MouseEvent) {
  if (open.value && root.value && !root.value.contains(e.target as Node)) closeMenu(false)
}

async function ask(p: Provider) {
  if (p.prefill) {
    window.open(p.prefill + encodeURIComponent(prompt.value), '_blank', 'noopener')
  } else {
    // Copy first (needs the user gesture / focus), then open the chat in a new tab.
    const ok = await copyText(prompt.value)
    notify(ok ? `Prompt copied — paste it into ${p.name}` : 'Could not copy the prompt')
    window.open(p.url, '_blank', 'noopener')
  }
  closeMenu(false)
}

onMounted(() => document.addEventListener('click', onDocClick))
onBeforeUnmount(() => document.removeEventListener('click', onDocClick))
</script>

<template>
  <div v-if="visible" ref="root" class="page-actions">
    <div class="split">
      <button type="button" class="seg main" :disabled="copying" @click="copyPage">
        <span :class="copiedPage ? 'i-solar-copy-check-linear' : 'i-solar-copy-linear'" aria-hidden="true" />
        {{ copiedPage ? 'Copied' : 'Copy page' }}
      </button>
      <button
        ref="trigger"
        type="button"
        class="seg caret"
        aria-haspopup="menu"
        :aria-expanded="open"
        aria-controls="page-actions-menu"
        aria-label="More page actions: view as Markdown, ask AI"
        @click="open ? closeMenu(false) : openMenu()"
        @keydown="onTriggerKey"
      >
        <span class="i-solar-alt-arrow-down-linear chev" :class="{ up: open }" aria-hidden="true" />
      </button>
    </div>
    <Transition name="pa-menu">
      <div
        v-show="open"
        id="page-actions-menu"
        ref="menu"
        class="menu"
        role="menu"
        aria-label="Page actions"
        @keydown="onMenuKey"
      >
        <a role="menuitem" tabindex="-1" class="item" :href="mdPath" target="_blank" rel="noopener" @click="closeMenu(false)">
          <span class="i-solar-document-text-linear item-icon" aria-hidden="true" />
          <span class="item-text">
            <span class="item-label">View as Markdown</span>
            <span class="item-hint">Open this page as plain text</span>
          </span>
        </a>
        <div class="sep" role="separator" />
        <p class="group-label" aria-hidden="true">Ask AI about this page</p>
        <button
          v-for="p in providers"
          :key="p.name"
          type="button"
          role="menuitem"
          tabindex="-1"
          class="item"
          @click="ask(p)"
        >
          <span :class="p.icon" class="item-icon" aria-hidden="true" />
          <span class="item-text">
            <span class="item-label">Open in {{ p.name }}</span>
            <span class="item-hint">{{ p.prefill ? 'Starts a chat with this page' : 'Copies a prompt to paste' }}</span>
          </span>
          <span class="i-solar-arrow-right-up-linear ext" aria-hidden="true" />
        </button>
      </div>
    </Transition>
    <Teleport to="body">
      <Transition name="docs-toast">
        <div v-if="toast" class="docs-toast" role="status" aria-live="polite">
          <span class="i-solar-copy-check-linear" aria-hidden="true" />{{ toast }}
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.page-actions {
  position: relative;
  display: flex;
  justify-content: flex-end;
  margin-bottom: 16px;
  z-index: 20;
}
@media (min-width: 768px) {
  .page-actions {
    position: absolute;
    top: 0;
    right: 0;
    margin: 0;
  }
}
.split {
  display: inline-flex;
  border: 1px solid var(--docs-hairline-strong);
  border-radius: 10px;
  background: var(--vp-c-bg);
  box-shadow: var(--docs-shadow);
  overflow: hidden;
}
.seg {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  height: 34px;
  padding: 0 12px;
  font-size: 13.5px;
  font-weight: 500;
  color: var(--vp-c-text-1);
  transition: background-color 0.15s;
}
.seg:hover {
  background: var(--docs-hover);
}
.seg:focus-visible {
  outline: 2px solid var(--docs-ink);
  outline-offset: -2px;
}
.seg:disabled {
  opacity: 0.6;
}
.seg.caret {
  padding: 0 10px;
  border-left: 1px solid var(--docs-hairline-strong);
}
.seg [class^='i-solar'] {
  width: 16px;
  height: 16px;
  color: var(--vp-c-text-2);
}
.chev {
  width: 14px !important;
  height: 14px !important;
  transition: transform 0.15s;
}
.chev.up {
  transform: rotate(180deg);
}
.menu {
  position: absolute;
  right: 0;
  top: calc(100% + 6px);
  width: 290px;
  padding: 6px;
  border: 1px solid var(--docs-hairline);
  border-radius: 14px;
  background: var(--vp-c-bg-elv);
  box-shadow: var(--docs-shadow-lg);
}
.item {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 8px 10px;
  text-align: left;
  color: var(--vp-c-text-1) !important;
  text-decoration: none !important;
  border-radius: 9px;
}
.item:hover,
.item:focus-visible {
  outline: none;
  background: var(--docs-hover);
}
.item-icon {
  flex-shrink: 0;
  width: 18px;
  height: 18px;
  color: var(--vp-c-text-1);
}
.item-text {
  display: flex;
  flex-direction: column;
  min-width: 0;
}
.item-label {
  font-size: 13.5px;
  font-weight: 500;
  line-height: 1.35;
}
.item-hint {
  font-size: 12px;
  line-height: 1.35;
  color: var(--vp-c-text-3);
}
.ext {
  margin-left: auto;
  width: 13px;
  height: 13px;
  color: var(--vp-c-text-3);
}
.sep {
  height: 1px;
  margin: 6px 4px;
  background: var(--docs-hairline);
}
.group-label {
  margin: 4px 10px 2px;
  font-size: 11.5px;
  font-weight: 500;
  color: var(--vp-c-text-3);
}
.pa-menu-enter-active,
.pa-menu-leave-active {
  transition: opacity 0.12s, transform 0.12s;
}
.pa-menu-enter-from,
.pa-menu-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
