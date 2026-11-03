---
title: Custom Theme
description: Brand the editor with your own colors using --vje-* CSS variables.
---

# Custom Theme

The modern themes are driven by `--vje-*` CSS variables. Add a class to the component and override the variables you need: no `!important`, no deep selectors. This demo uses a rose brand palette on top of the `light` theme.

<script setup>
import CustomTheme from './demos/CustomTheme.vue'
import customThemeCode from './demos/CustomTheme.vue?raw'
</script>

<llm-exclude>

<DemoBlock title="Custom theme" :code="customThemeCode">
  <CustomTheme />
</DemoBlock>

</llm-exclude>

<llm-only>

```vue
<script setup>
import { ref } from 'vue'
import Vue3Jsoneditor from 'v3-jsoneditor'

const json = ref({
  brand: 'Acme',
  palette: { primary: '#e11d48', surface: '#fff1f2' },
  features: ['fast', 'friendly'],
})
</script>

<template>
  <Vue3Jsoneditor
    v-model="json"
    class="brand-editor"
    current-mode="tree"
    theme="light"
    height="300px"
  />
</template>

<style>
.brand-editor.v3-jsoneditor {
  --vje-accent: #e11d48;
  --vje-bg: #ffffff;
  --vje-surface: #fff1f2;
  --vje-border: #fecdd3;
  --vje-text: #4c0519;
  --vje-muted: #9f1239;
  --vje-radius: 14px;
  --vje-shadow: 0 8px 24px rgba(225, 29, 72, 0.15);
}
</style>
```

</llm-only>

## Supporting dark mode

When using `theme="auto"`, add a dark variant of your palette scoped to the dark state, for example:

```css
html.dark .brand-editor {
  --vje-bg: #1c0a10;
  --vje-surface: #2a0f18;
  --vje-border: #4c0519;
  --vje-text: #ffe4e6;
  --vje-muted: #fda4af;
}
```

All variables are listed in the [Theming guide](/guide/theming#css-variables).
