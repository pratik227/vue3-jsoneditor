---
title: Theming
description: Choose between the light, dark, auto and classic themes, customize colors with CSS variables, and scope overrides per editor.
---

# Theming

v3-jsoneditor ships a modern look on top of jsoneditor, with matching styling for the menu bar, tree, Ace code editor and modals.

## The `theme` prop

| Value | Description |
| --- | --- |
| `light` | Modern light theme. **Default.** |
| `dark` | Modern dark theme, including dark styling for the Ace code editor. |
| `auto` | Follows the page: dark when an ancestor `html` element has the `dark` class (VitePress, Nuxt Color Mode, Tailwind `darkMode: 'class'`), otherwise follows the operating system's `prefers-color-scheme`. |
| `classic` | The original jsoneditor look (blue menu bar), as in v3-jsoneditor 0.0.x. |

```vue
<Vue3Jsoneditor v-model="json" theme="dark" />
<Vue3Jsoneditor v-model="json" theme="auto" />
<Vue3Jsoneditor v-model="json" theme="classic" />
```

<llm-exclude>

<ThemeGallery />

</llm-exclude>

<llm-only>

Theme gallery summary: `light` uses a white background, light gray surfaces and an indigo accent. `dark` uses a near-black background, dark gray surfaces, light text and dark styling for the Ace code editor. `auto` switches between `light` and `dark` based on the `html.dark` class or `prefers-color-scheme`. `classic` keeps jsoneditor's original styling with its blue (`#3883fa`) menu bar and default Ace theme.

</llm-only>

## CSS variables

The modern themes (`light`, `dark`, `auto`) are driven by CSS custom properties on the `.v3-jsoneditor` root element. Override any of them to match your brand.

| Variable | Purpose |
| --- | --- |
| `--vje-accent` | Accent color: menu highlights, active mode, focus rings, selection. |
| `--vje-bg` | Editor background. |
| `--vje-surface` | Menu bar, navigation bar and status bar background. |
| `--vje-border` | Border and divider color. |
| `--vje-text` | Main text color. |
| `--vje-muted` | Secondary text: field names, line numbers, placeholders. |
| `--vje-radius` | Corner radius of the editor and its controls. |
| `--vje-font-mono` | Monospace font used in tree, code and text modes. |
| `--vje-shadow` | Shadow of the editor container, menus and modals. |
| `--vje-z-fullscreen` | `z-index` of the editor in fullscreen mode. |

### Global overrides

Apply to every editor on the page:

```css
.v3-jsoneditor {
  --vje-accent: #10b981;
  --vje-radius: 12px;
  --vje-font-mono: 'JetBrains Mono', ui-monospace, monospace;
}
```

### Scoped overrides

Add a class to a single editor and override variables only there:

```vue
<template>
  <Vue3Jsoneditor v-model="json" class="brand-editor" />
</template>

<style>
.brand-editor.v3-jsoneditor {
  --vje-accent: #e11d48;
  --vje-surface: #fff1f2;
  --vje-border: #fecdd3;
}
</style>
```

Classes set on the component are applied to its root element, the same element that carries `.v3-jsoneditor`. Combine both classes (`.brand-editor.v3-jsoneditor`) so your values win over the built-in theme regardless of stylesheet order, with no `!important` needed.

::: tip
For a dark variant of a custom palette, scope your values under the dark theme too, for example `html.dark .brand-editor { ... }` when you use `theme="auto"`.
:::

See the [Custom theme example](/examples/custom-theme) for a live demo.

## Dark Ace editor

In `code` mode, jsoneditor uses the Ace editor. The modern themes restyle jsoneditor's default Ace theme with the same CSS variables (gutter, active line, selection, cursor and JSON token colors), so `dark` and `auto` give you a dark code editor without loading anything extra. To use a different Ace theme, set `options.theme` (for example `options: { theme: 'ace/theme/monokai' }`) and load that theme yourself. The component's color overrides only apply to the default theme.

## Toolbar icons

The modern themes replace jsoneditor's sprite icons in the menu bar with crisp [Solar](https://icon-sets.iconify.design/solar/) icons that pick up `--vje-text` and `--vje-accent`. The `classic` theme keeps jsoneditor's original sprite.

## CSS delivery and CSP

In the ESM build, the theme CSS is injected automatically by JavaScript, so there is nothing to import. For CDN or strict Content Security Policy setups, `dist/style.css` is also published and can be linked as a regular stylesheet.

## Going further

Need more than variables? All jsoneditor class names (`.jsoneditor`, `.jsoneditor-menu`, `.jsoneditor-tree`, ...) are still present, so you can target them with regular CSS scoped under your own class.
