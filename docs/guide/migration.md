---
title: Migration to 0.1
description: Upgrade from v3-jsoneditor 0.0.x to 0.1.0, covering the new default theme, merged option callbacks, import path, jsoneditor v10 and new features.
---

# Migration to 0.1

Version 0.1.0 modernizes v3-jsoneditor while keeping the core API (`v-model`, `options`, `currentMode`, `modeList`, `language`, `height`, `plus`) intact. Most apps upgrade without code changes. This page lists what behaves differently and what is new.

## Breaking or visible changes

### New default theme

The default `theme` is now the modern `light` theme. To keep the original jsoneditor look (blue menu bar), set `theme="classic"`:

```vue
<Vue3Jsoneditor v-model="json" theme="classic" />
```

See [Theming](/guide/theming).

### Option callbacks are merged, not overridden

Previously, a callback in `options` such as `onChange` could replace the component's internal handler (breaking `v-model`), or be replaced by it. Now **both run**: the component's handler (which emits events) and yours. If you used `options.onChange` as a workaround for missing events, you may now receive two notifications if you also listen to `@change`; keep one.

### Options are honored more consistently

- The starting mode comes from the `currentMode` prop (default `'code'`). Props take precedence over `options`, which take precedence over defaults.
- `options.indentation` is now respected. The default is `2`.

### Clearing the editor emits `null`

Emptying the editor in `code` or `text` mode now emits `null` through `update:modelValue` instead of leaving the previous value.

### `modelValue` accepts any JSON

`modelValue` is no longer restricted to objects. Arrays, strings, numbers, booleans and `null` are all valid, so Vue no longer warns about prop types for these.

### jsoneditor v10

The underlying jsoneditor is upgraded to v10. It drops Internet Explorer 11 support. If you used jsoneditor APIs through `getEditor()`, check the [jsoneditor changelog](https://github.com/josdejong/jsoneditor/blob/master/CHANGELOG.md).

### Import path

The package entry is now the preferred import:

```js
// Before
import Vue3Jsoneditor from 'v3-jsoneditor/src/Vue3Jsoneditor.vue'

// After
import Vue3Jsoneditor from 'v3-jsoneditor'
```

The old path still works, so this change is optional, but the package entry is what the TypeScript types describe.

### Built-in color picker works again

jsoneditor's built-in color picker now works. The component only overrides `onColorPicker` if you listen to `@colorPicker` or pass `options.onColorPicker`.

## New features

- `theme` prop: `light`, `dark`, `auto`, `classic`.
- `v-model:currentMode` and the `mode-change(newMode, oldMode)` event.
- `v-model:fullscreen` and the `fullscreen-change` event; the fullscreen button works in every mode and <kbd>Esc</kbd> exits.
- `validation-error` event for schema and custom validation.
- Reactive `options.schema`.
- `#toolbar` slot to add your own buttons to the menu bar.
- `v-model:text` for the raw editor text.
- `readOnly`, `debounce`, `indentation`, `mainMenuBar`, `navigationBar` and `statusBar` props.
- Global defaults: `app.use(Vue3Jsoneditor, { theme: 'auto', height: 500, ... })`, including a custom `componentName`.
- Default slot for placeholder content until the editor mounts.
- `getEditor()`, `get()`, `getText()`, `validate()`, `collapseAll()` and `focus()` methods.
- `height` accepts numbers (pixels).
- TypeScript types with JSDoc.
- SSR-safe import for Nuxt and VitePress.

## Upgrade checklist

1. Update the package: `npm install v3-jsoneditor@latest`.
2. Change imports to `import Vue3Jsoneditor from 'v3-jsoneditor'`.
3. Add `theme="classic"` if you want the old appearance.
4. If you passed `options.onChange` (or other callbacks) *and* listen to the matching event, remove the duplicate.
5. If your code treats an empty editor specially, handle `null` from `v-model`.
