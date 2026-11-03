---
title: Events
description: Reference of all events emitted by v3-jsoneditor, including v-model updates, change, error, validation-error, mode-change, fullscreen-change, focus and selection events.
---

# Events

All events emitted by `<Vue3Jsoneditor>`. Listen with `@event-name` in templates.

| Event | Payload | Description |
| --- | --- | --- |
| `update:modelValue` | `(json: any)` | The content changed and is valid JSON. Used by `v-model`. Emits `null` when the editor is cleared in `code`/`text` mode. |
| `change` | `(json: any)` | Same as `update:modelValue`, as a plain event. |
| `error` | `(err: Error)` | The text in `code`/`text` mode is not valid JSON. The model keeps its last valid value. |
| `validation-error` | `(errors: Array)` | Validation ran (`options.schema` and/or `options.onValidate`). Each error is a jsoneditor validation error (`{ path, message, ... }`). Empty array means valid. |
| `update:text` | `(text: string)` | The raw text changed (may be invalid JSON). Used by `v-model:text`. |
| `update:currentMode` | `(mode: string)` | The mode changed. Used by `v-model:currentMode`. |
| `mode-change` | `(newMode: string, oldMode: string)` | The mode changed, with the previous mode. |
| `update:fullscreen` | `(value: boolean)` | Fullscreen was entered or exited. Used by `v-model:fullscreen`. |
| `fullscreen-change` | `(value: boolean)` | Same as `update:fullscreen`, as a plain event. |
| `focus` | `(editor: JSONEditor, target: HTMLElement)` | The editor gained focus. |
| `blur` | `(editor: JSONEditor, target: HTMLElement)` | The editor lost focus. |
| `textSelectionChange` | `(editor: JSONEditor, start: {row, column}, end: {row, column}, text: string)` | Text selection changed in `code`/`text` mode. |
| `selectionChange` | `(editor: JSONEditor, start: Node, end: Node)` | Node selection changed in `tree` mode. |
| `colorPicker` | `(editor: JSONEditor, parent: HTMLElement, color: string, onChange: (color: string) => void)` | A color picker was requested (`tree` mode, color values). Call `onChange` with the new color. Only overrides jsoneditor's built-in picker when you listen to this event (or pass `options.onColorPicker`). |

## Example

```vue
<script setup>
import { ref } from 'vue'
import Vue3Jsoneditor from 'v3-jsoneditor'

const json = ref({ hello: 'world' })
const log = ref([])

const push = (msg) => log.value.unshift(msg)
</script>

<template>
  <Vue3Jsoneditor
    v-model="json"
    @change="(v) => push('change')"
    @error="(e) => push('error: ' + e.message)"
    @validation-error="(errs) => push(errs.length + ' validation errors')"
    @mode-change="(m, old) => push(`mode ${old} -> ${m}`)"
    @fullscreen-change="(on) => push('fullscreen ' + on)"
    @focus="push('focus')"
    @blur="push('blur')"
  />
  <ul><li v-for="(l, i) in log" :key="i">{{ l }}</li></ul>
</template>
```

## Notes

- `update:modelValue`, `update:text` and `change` are debounced when the `debounce` prop is set.
- `change` and `update:modelValue` are not emitted when the change comes from the parent (an external `v-model` update), which prevents update loops.
- Event names `textSelectionChange`, `selectionChange` and `colorPicker` are camelCase. In templates you can write `@text-selection-change` or `@textSelectionChange`.
- Callbacks with the same purpose passed in `options` (for example `options.onFocus`) still run in addition to these events.

## Related

- [Props](/api/props)
- [Methods](/api/methods)
