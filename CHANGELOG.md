# Changelog

## 0.1.0 (unreleased)

### Breaking
- The default look is now the modern **light** theme. Use `theme="classic"` for the original blue jsoneditor look.
- The default height is now `400px` (a zero-specificity rule, so any height you set yourself still wins).
- Clearing the editor now emits `null` instead of `{}`.
- Removed the automatic `window.Vue` install. It never worked with Vue 3; use `app.use(Vue3Jsoneditor)`.
- jsoneditor upgraded from 9.10 to 10.4 (drops Internet Explorer 11).

### Fixed
- Callbacks in `options` (`onChange`, `onModeChange`, `onFocus`, `onBlur`, ...) were silently replaced by the component's own handlers. They now run as well.
- `options.mode`, `options.modes`, `options.language` and `options.indentation` are now honored (props still take precedence).
- The full screen button was shown or hidden based on the initial `currentMode` prop instead of the actual mode, and could cover tree mode's search box. It now lives inside the menu bar in every mode.
- Two editors on one page no longer interfere with each other (the "powered by ace" check searched the whole document).
- jsoneditor's built-in color picker works again. `onColorPicker` is only overridden when you listen to `@colorPicker` or pass `options.onColorPicker`.
- `currentMode`, `options.schema`, `modeList`, `language`, `readOnly` and menu-bar props now react to changes after mount.
- External `v-model` updates use jsoneditor's `update()` instead of `set()`.
- Importing the component during SSR (Nuxt, VitePress) no longer crashes: jsoneditor is loaded in `onMounted`.
- The published bundle no longer contains a copy of Vue (4.5 MB down to about 12 KB ESM plus CSS).

### Added
- `theme` prop: `light`, `dark`, `auto`, `classic`, driven by `--vje-*` CSS variables.
- Solar icons in the toolbar, with a modern menu bar, search box, context menu, status bar and Ace styling.
- `v-model:currentMode`, `v-model:fullscreen`, `v-model:text`.
- Props `readOnly`, `debounce`, `indentation`, `mainMenuBar`, `navigationBar`, `statusBar`. `height` also accepts numbers.
- Events `mode-change`, `validation-error`, `fullscreen-change`, `update:text`.
- Methods `getEditor()`, `get()`, `getText()`, `validate()`, `focus()`, `collapseAll()`.
- `#toolbar` slot for custom menu-bar buttons, and a default slot as a loading placeholder.
- Accessible full screen: a real `<button>` with a label, Esc to exit, body scroll lock.
- Global defaults: `app.use(Vue3Jsoneditor, { componentName, theme, height, options, ... })`.
- TypeScript types (`index.d.ts`).
- Vite build with ESM and UMD outputs, `exports` map, `peerDependencies`, and `llms.txt` shipped in the package.
- New VitePress documentation site with a playground and AI-friendly output (`llms.txt`, per-page Markdown).
