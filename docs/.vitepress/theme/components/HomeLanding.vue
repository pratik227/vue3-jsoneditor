<script setup lang="ts">
import { withBase } from 'vitepress'
import HomeHero from './HomeHero.vue'
import HomeInstall from './HomeInstall.vue'
</script>

<template>
  <section class="landing">
    <div class="hero">
      <a class="eyebrow" :href="withBase('/guide/migration')">
        <span class="pill">New</span> jsoneditor v10, themes &amp; SSR support
        <span class="i-solar-arrow-right-linear" aria-hidden="true" />
      </a>
      <h1 class="headline">The JSON editor<br />for Vue&nbsp;3</h1>
      <p class="subline">
        View, edit, format and validate JSON in five modes. One component, v-model ready, themeable and SSR-safe.
      </p>
      <div class="ctas">
        <a class="btn primary" :href="withBase('/guide/getting-started')">Get started</a>
        <a class="btn secondary" :href="withBase('/playground')">Open playground</a>
      </div>
      <HomeInstall />
    </div>

    <div class="showcase">
      <div class="backdrop" aria-hidden="true" />
      <div class="stage">
        <HomeHero />
      </div>
    </div>
  </section>
</template>

<style scoped>
.landing {
  padding: 72px 0 24px;
}
@media (min-width: 768px) {
  .landing {
    padding: 104px 0 32px;
  }
}
.hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}
.eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 28px;
  padding: 4px 12px 4px 4px;
  font-size: 13px;
  font-weight: 500;
  color: var(--vp-c-text-2) !important;
  text-decoration: none !important;
  border: 1px solid var(--docs-hairline);
  border-radius: 999px;
  background: var(--vp-c-bg);
  transition: border-color 0.15s;
}
.eyebrow:hover {
  border-color: var(--docs-hairline-strong);
}
.eyebrow .pill {
  padding: 2px 8px;
  font-size: 12px;
  color: var(--docs-ink-contrast);
  background: var(--docs-ink);
  border-radius: 999px;
}
.eyebrow [class^='i-solar'] {
  width: 14px;
  height: 14px;
}
.headline {
  margin: 0;
  padding: 0;
  border: 0;
  font-size: clamp(40px, 7vw, 76px);
  font-weight: 600;
  line-height: 1.02;
  letter-spacing: -0.035em;
  color: var(--vp-c-text-1);
}
.subline {
  max-width: 560px;
  margin: 24px 0 0 !important;
  font-size: 18px;
  line-height: 1.6 !important;
  color: var(--vp-c-text-2);
}
.ctas {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  margin-top: 32px;
}
.btn {
  display: inline-flex;
  align-items: center;
  height: 44px;
  padding: 0 22px;
  font-size: 15px;
  font-weight: 500;
  border-radius: 999px;
  text-decoration: none !important;
  transition: background-color 0.15s, border-color 0.15s;
}
.btn.primary {
  color: var(--docs-ink-contrast) !important;
  background: var(--docs-ink);
}
.btn.primary:hover {
  background: var(--vp-button-brand-hover-bg);
}
.btn.secondary {
  color: var(--vp-c-text-1) !important;
  border: 1px solid var(--docs-hairline-strong);
  background: var(--vp-c-bg);
}
.btn.secondary:hover {
  border-color: var(--vp-c-text-3);
}
.btn:focus-visible {
  outline: 2px solid var(--docs-ink);
  outline-offset: 2px;
}

.showcase {
  position: relative;
  margin-top: 64px;
  padding: 12px;
  border-radius: 28px;
  border: 1px solid var(--docs-hairline);
  overflow: hidden;
}
@media (min-width: 768px) {
  .showcase {
    padding: 56px 72px;
    border-radius: 32px;
  }
}
.backdrop {
  position: absolute;
  inset: 0;
  background: var(--pastel-1);
}
.backdrop::after {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(40% 60% at 85% 80%, rgba(255, 214, 170, 0.55), transparent 70%),
    radial-gradient(35% 50% at 10% 20%, rgba(186, 230, 253, 0.6), transparent 70%);
}
:global(.dark .showcase .backdrop::after) {
  background:
    radial-gradient(40% 60% at 85% 80%, rgba(255, 160, 90, 0.14), transparent 70%),
    radial-gradient(35% 50% at 10% 20%, rgba(90, 180, 255, 0.16), transparent 70%);
}
.stage {
  position: relative;
  max-width: 920px;
  margin: 0 auto;
}
</style>
