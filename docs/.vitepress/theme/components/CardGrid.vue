<script setup lang="ts">
import { withBase } from 'vitepress'

export interface CardItem {
  title: string
  details: string
  link: string
  icon: string
  tone?: 1 | 2 | 3 | 4 | 5
}

const props = withDefaults(defineProps<{ items?: CardItem[]; cols?: 2 | 3 }>(), { cols: 3 })

const defaults: CardItem[] = [
  {
    title: 'Get started',
    details: 'Install the package and render your first editor in a minute.',
    link: '/guide/getting-started',
    icon: 'i-solar-rocket-bold-duotone',
    tone: 1,
  },
  {
    title: 'Guides',
    details: 'Usage, validation, theming, fullscreen and SSR in depth.',
    link: '/guide/usage',
    icon: 'i-solar-book-bold-duotone',
    tone: 2,
  },
  {
    title: 'API Reference',
    details: 'Every prop, event and exposed method, with types.',
    link: '/api/props',
    icon: 'i-solar-code-square-bold-duotone',
    tone: 3,
  },
  {
    title: 'Examples',
    details: 'Live, copyable demos from basic to custom toolbars.',
    link: '/examples/',
    icon: 'i-solar-layers-bold-duotone',
    tone: 4,
  },
  {
    title: 'Use with AI',
    details: 'llms.txt, Markdown pages and prompts for your assistant.',
    link: '/ai/',
    icon: 'i-solar-stars-bold-duotone',
    tone: 5,
  },
  {
    title: 'Playground',
    details: 'Try every option live and copy the generated SFC.',
    link: '/playground',
    icon: 'i-solar-programming-bold-duotone',
    tone: 2,
  },
]

const list = () => props.items ?? defaults
</script>

<template>
  <div class="card-grid" :class="`cols-${cols}`">
    <a v-for="(c, i) in list()" :key="c.link" class="card" :href="withBase(c.link)">
      <span class="thumb" :style="{ background: `var(--pastel-${c.tone ?? (i % 5) + 1})` }" aria-hidden="true">
        <span :class="c.icon" />
      </span>
      <span class="text">
        <span class="title">{{ c.title }}</span>
        <span class="details">{{ c.details }}</span>
      </span>
    </a>
  </div>
</template>

<style scoped>
.card-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
  margin: 24px 0;
}
@media (min-width: 640px) {
  .card-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (min-width: 1100px) {
  .card-grid.cols-3 {
    grid-template-columns: repeat(3, 1fr);
  }
}
.card {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 14px;
  border: 1px solid var(--docs-hairline);
  border-radius: 16px;
  background: var(--vp-c-bg);
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
  display: grid;
  place-items: center;
  height: 88px;
  border-radius: 10px;
  color: #0a0a0a;
}
:global(.dark .thumb ){
  color: #fafafa;
}
.thumb span {
  width: 30px;
  height: 30px;
  opacity: 0.85;
}
.text {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 0 4px 4px;
}
.title {
  font-size: 15px;
  font-weight: 600;
  letter-spacing: -0.01em;
  color: var(--vp-c-text-1);
}
.details {
  font-size: 13.5px;
  line-height: 1.55;
  color: var(--vp-c-text-2);
}
</style>
