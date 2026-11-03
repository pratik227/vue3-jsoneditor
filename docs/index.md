---
layout: home
title: v3-jsoneditor
titleTemplate: The JSON editor for Vue 3
pageClass: home-page
---

<HomeLanding />

<section class="home-section">

<p class="home-kicker">Features</p>

## Everything you need to edit JSON in Vue {.home-h2}

<p class="home-lead">A thin, well-typed wrapper around the battle-tested <code>jsoneditor</code> — with the Vue ergonomics you expect.</p>

<FeatureGrid />

</section>

<section class="home-section">

<p class="home-kicker">Quick start</p>

## Up and running in a minute {.home-h2}

<div class="home-quickstart">
<div>

**1. Install**

::: code-group

```bash [npm]
npm install v3-jsoneditor
```

```bash [pnpm]
pnpm add v3-jsoneditor
```

```bash [yarn]
yarn add v3-jsoneditor
```

```bash [bun]
bun add v3-jsoneditor
```

:::

Then read the [Getting Started guide](/guide/getting-started) or try every option in the [Playground](/playground).

</div>
<div>

**2. Use it**

```vue [App.vue]
<script setup>
import { ref } from 'vue'
import Vue3Jsoneditor from 'v3-jsoneditor'

const json = ref({ hello: 'world' })
</script>

<template>
  <Vue3Jsoneditor v-model="json" height="400px" />
</template>
```

</div>
</div>

</section>

<style>
.home-page .VPHomeContent,
.home-page .vp-doc.container {
  max-width: 1200px;
}
.home-section {
  padding: 72px 0 8px;
}
.home-section:last-of-type {
  padding-bottom: 96px;
}
.home-kicker {
  margin: 0 0 8px !important;
  font-size: 13px;
  font-weight: 500;
  color: var(--vp-c-text-3);
}
.vp-doc h2.home-h2 {
  margin: 0;
  font-size: clamp(28px, 4vw, 40px);
  line-height: 1.15;
  font-weight: 600;
  letter-spacing: -0.03em;
}
.vp-doc h2.home-h2 .header-anchor {
  display: none;
}
.home-lead {
  max-width: 600px;
  margin: 12px 0 0 !important;
  font-size: 17px;
  color: var(--vp-c-text-2);
}
.home-quickstart {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 8px 32px;
  margin-top: 24px;
}
.home-quickstart > div {
  min-width: 0;
}
@media (min-width: 960px) {
  .home-quickstart {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
.home-quickstart strong {
  font-weight: 600;
}
</style>
