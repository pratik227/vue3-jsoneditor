<script setup lang="ts">
import { withBase } from 'vitepress'

interface Feature {
  icon: string
  title: string
  details: string
  link: string
  tone: 1 | 2 | 3 | 4 | 5
  wide?: boolean
}

const features: Feature[] = [
  {
    icon: 'i-solar-widget-4-bold-duotone',
    title: 'Five editing modes',
    details: 'Tree, code, form, text and view. Switch at runtime and keep the active mode in sync with v-model:currentMode.',
    link: '/guide/usage',
    tone: 1,
    wide: true,
  },
  {
    icon: 'i-solar-shield-check-bold-duotone',
    title: 'JSON Schema validation',
    details: 'Pass a schema and get inline errors plus a validation-error event.',
    link: '/guide/validation',
    tone: 2,
  },
  {
    icon: 'i-solar-transfer-horizontal-bold-duotone',
    title: 'v-model two-way binding',
    details: 'Edits flow out, external updates flow in — no cursor jumps or loops.',
    link: '/api/props',
    tone: 3,
  },
  {
    icon: 'i-solar-pallete-2-bold-duotone',
    title: 'Themes & dark mode',
    details: 'Light, dark, auto and classic, plus CSS variables for any design system.',
    link: '/guide/theming',
    tone: 4,
  },
  {
    icon: 'i-solar-maximize-square-bold-duotone',
    title: 'Accessible fullscreen',
    details: 'Esc to exit, focus kept, and v-model:fullscreen for full control.',
    link: '/guide/fullscreen',
    tone: 5,
  },
  {
    icon: 'i-solar-server-bold-duotone',
    title: 'SSR-safe',
    details: 'jsoneditor loads lazily on mount. Works in Nuxt, VitePress and friends.',
    link: '/guide/ssr',
    tone: 2,
  },
  {
    icon: 'i-solar-stars-bold-duotone',
    title: 'AI-ready docs',
    details: 'llms.txt, llms-full.txt and per-page Markdown, with one-click Ask AI.',
    link: '/ai/',
    tone: 3,
  },
  {
    icon: 'i-solar-code-square-bold-duotone',
    title: 'TypeScript types',
    details: 'Typed props, events and exposed methods for great autocompletion.',
    link: '/api/methods',
    tone: 1,
  },
]
</script>

<template>
  <div class="bento">
    <a
      v-for="f in features"
      :key="f.title"
      class="card"
      :class="{ wide: f.wide }"
      :href="withBase(f.link)"
    >
      <span class="thumb" :style="{ background: `var(--pastel-${f.tone})` }" aria-hidden="true">
        <span class="tile"><span :class="f.icon" /></span>
      </span>
      <span class="body">
        <span class="title">{{ f.title }}</span>
        <span class="details">{{ f.details }}</span>
      </span>
    </a>
  </div>
</template>

<style scoped>
.bento {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  margin: 32px 0 8px;
}
@media (min-width: 640px) {
  .bento {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (min-width: 960px) {
  .bento {
    grid-template-columns: repeat(3, 1fr);
  }
  .card.wide {
    grid-column: span 2;
  }
}
.card {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--docs-hairline);
  border-radius: 20px;
  background: var(--vp-c-bg);
  overflow: hidden;
  color: inherit !important;
  text-decoration: none !important;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.card:hover {
  border-color: var(--docs-hairline-strong);
  box-shadow: var(--docs-shadow-lg);
}
.card:focus-visible {
  outline: 2px solid var(--docs-ink);
  outline-offset: 2px;
}
.thumb {
  position: relative;
  display: grid;
  place-items: center;
  height: 140px;
  border-bottom: 1px solid var(--docs-hairline);
}
.tile {
  display: grid;
  place-items: center;
  width: 56px;
  height: 56px;
  border-radius: 16px;
  color: #0a0a0a;
  background: rgba(255, 255, 255, 0.82);
  box-shadow: 0 1px 2px rgba(10, 10, 10, 0.06), 0 8px 24px -10px rgba(10, 10, 10, 0.25);
  backdrop-filter: blur(6px);
  transition: transform 0.25s;
}
:global(.dark .tile ){
  color: #fafafa;
  background: rgba(24, 24, 27, 0.75);
}
.card:hover .tile {
  transform: translateY(-2px) scale(1.04);
}
.tile span {
  width: 28px;
  height: 28px;
}
.body {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 18px 20px 20px;
}
.title {
  font-size: 16px;
  font-weight: 600;
  letter-spacing: -0.01em;
  color: var(--vp-c-text-1);
}
.details {
  font-size: 14px;
  line-height: 1.6;
  color: var(--vp-c-text-2);
}
</style>
