<script setup lang="ts">
withDefaults(defineProps<{ href?: string }>(), { href: 'https://github.com/sponsors/pratik227' })
</script>

<template>
  <a class="sponsor-card" :href="href" target="_blank" rel="noopener">
    <span class="icon" aria-hidden="true"><span class="i-solar-hand-heart-linear" /></span>
    <span class="body">
      <strong>Sponsor v3-jsoneditor</strong>
      <span>If this component saves you time, consider supporting its maintenance on GitHub Sponsors.</span>
    </span>
    <span class="i-solar-arrow-right-up-linear arrow" aria-hidden="true" />
  </a>
</template>

<style scoped>
.sponsor-card {
  display: flex;
  align-items: center;
  gap: 16px;
  margin: 32px 0 8px;
  padding: 16px 18px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 14px;
  background: linear-gradient(120deg, rgba(236, 72, 153, 0.07), rgba(124, 77, 255, 0.07));
  color: inherit;
  text-decoration: none !important;
  transition: border-color 0.2s, transform 0.2s;
}
.sponsor-card:hover {
  border-color: #ec4899;
  transform: translateY(-1px);
}
.sponsor-card:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 2px;
}
.icon {
  display: grid;
  place-items: center;
  flex-shrink: 0;
  width: 42px;
  height: 42px;
  border-radius: 12px;
  color: #db2777;
  background: rgba(236, 72, 153, 0.12);
}
.icon span {
  width: 22px;
  height: 22px;
}
.body {
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-size: 14px;
  line-height: 1.5;
  color: var(--vp-c-text-2);
}
.body strong {
  color: var(--vp-c-text-1);
  font-size: 15px;
}
.arrow {
  margin-left: auto;
  flex-shrink: 0;
  color: var(--vp-c-text-3);
}
</style>
