<script setup lang="ts">
import { ref } from 'vue'
import { useData } from 'vitepress'
import Vue3Jsoneditor from 'v3-jsoneditor'

const { isDark } = useData()

const modes = ['tree', 'code', 'form', 'text', 'view'] as const
const mode = ref<(typeof modes)[number]>('tree')

const json = ref<Record<string, unknown>>({
  name: 'v3-jsoneditor',
  framework: 'Vue 3',
  modes: ['tree', 'code', 'form', 'text', 'view'],
  features: {
    vModel: true,
    jsonSchema: true,
    darkMode: true,
    ssrSafe: true,
  },
  stars: 128,
  license: 'MIT',
})
</script>

<template>
  <div class="home-hero-editor">
    <div class="hhe-chrome">
      <div class="hhe-dots" aria-hidden="true"><span /><span /><span /></div>
      <div class="hhe-modes" role="tablist" aria-label="Editor mode">
        <button
          v-for="m in modes"
          :key="m"
          type="button"
          role="tab"
          class="hhe-mode"
          :class="{ active: mode === m }"
          :aria-selected="mode === m"
          @click="mode = m"
        >
          {{ m }}
        </button>
      </div>
    </div>
    <div class="hhe-body">
      <ClientOnly>
        <Vue3Jsoneditor
          v-model="json"
          v-model:currentMode="mode"
          :theme="isDark ? 'dark' : 'light'"
          :mode-list="[...modes]"
          height="380px"
        />
      </ClientOnly>
    </div>
  </div>
</template>

<style scoped>
.home-hero-editor {
  width: 100%;
  border: 1px solid var(--vp-c-divider);
  border-radius: 20px;
  background: var(--vp-c-bg);
  box-shadow: 0 1px 2px rgba(10, 10, 10, 0.04), 0 30px 60px -30px rgba(40, 20, 80, 0.35);
  overflow: hidden;
  text-align: left;
}
.hhe-chrome {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-bottom: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
}
.hhe-dots {
  display: flex;
  gap: 6px;
  flex-shrink: 0;
}
.hhe-dots span {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--vp-c-divider);
}
.hhe-modes {
  display: flex;
  gap: 2px;
  margin-left: auto;
  padding: 3px;
  border-radius: 999px;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  overflow-x: auto;
  scrollbar-width: none;
}
.hhe-modes::-webkit-scrollbar {
  display: none;
}
@media (max-width: 520px) {
  .hhe-dots {
    display: none;
  }
}
.hhe-mode {
  padding: 3px 10px;
  font-size: 12px;
  font-weight: 500;
  font-family: var(--vp-font-family-mono);
  color: var(--vp-c-text-2);
  border-radius: 999px;
  transition: color 0.15s, background-color 0.15s;
}
.hhe-mode:hover {
  color: var(--vp-c-text-1);
}
.hhe-mode.active {
  color: var(--docs-ink-contrast);
  background: var(--docs-ink);
}
.hhe-mode:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 1px;
}
.hhe-body {
  min-height: 380px;
  background: repeating-linear-gradient(
    180deg,
    var(--vp-c-bg) 0 22px,
    var(--vp-c-bg-soft) 22px 23px
  );
}
.hhe-body :deep(.v3-jsoneditor) {
  border: 0;
  border-radius: 0;
  box-shadow: none;
}
</style>
