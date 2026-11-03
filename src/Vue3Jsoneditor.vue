<template>
  <div ref="rootRef" :class="rootClasses" :style="rootStyle">
    <div ref="editorRef" class="v3-jsoneditor__editor" />
    <div v-if="!ready && $slots.default" class="v3-jsoneditor__placeholder">
      <slot />
    </div>
    <Teleport v-if="actionsEl" :to="actionsEl">
      <slot name="toolbar" :editor="editorInstance" :mode="activeMode" />
      <button
        v-if="showFullscreenButton"
        type="button"
        class="v3-jsoneditor__btn"
        :title="isFullscreen ? 'Exit full screen (Esc)' : 'Full screen'"
        :aria-label="isFullscreen ? 'Exit full screen' : 'Enter full screen'"
        :aria-pressed="isFullscreen"
        @click="toggleFullScreen"
      >
        <span
          class="v3-jsoneditor__icon"
          :class="isFullscreen ? 'v3-jsoneditor__icon--fullscreen-exit' : 'v3-jsoneditor__icon--fullscreen-enter'"
          aria-hidden="true"
        />
      </button>
    </Teleport>
  </div>
</template>

<script>
export default {
  name: "Vue3Jsoneditor",
};
</script>

<script setup>
import {
  ref,
  shallowRef,
  computed,
  watch,
  inject,
  nextTick,
  onMounted,
  onBeforeUnmount,
  getCurrentInstance,
} from "vue";
import "jsoneditor/dist/jsoneditor.min.css";
import "./styles/icons.css";
import "./styles/theme.css";
import { CONFIG_KEY, ALL_MODES, TREE_MODES, THEMES } from "./config.js";

const props = defineProps({
  /** Bound JSON value (any JSON: object, array, string, number, boolean, null). */
  modelValue: { type: null, default: undefined },
  /** Raw editor text (`v-model:text`). May be invalid JSON while the user types. */
  text: { type: String, default: undefined },
  /** Any jsoneditor option, passed through to the constructor. */
  options: { type: Object, default: undefined },
  /** Active mode (`v-model:currentMode`). Default `'code'`. */
  currentMode: { type: String, default: undefined },
  /** Modes offered in the mode switcher. */
  modeList: { type: Array, default: undefined },
  /** UI language: en, zh-CN, pt-BR, tr, ja, fr-FR, de, ru, es. */
  language: { type: String, default: undefined },
  /** Height of the editor. Numbers are pixels. Default `400px`. */
  height: { type: [String, Number], default: undefined },
  /** Show the full screen button. Default `true`. */
  plus: { type: Boolean, default: undefined },
  /** Full screen state (`v-model:fullscreen`). */
  fullscreen: { type: Boolean, default: undefined },
  /** `'light'` (default), `'dark'`, `'auto'` or `'classic'`. */
  theme: {
    type: String,
    default: undefined,
    validator: (value) => THEMES.includes(value),
  },
  /** Make the editor read-only in every mode. */
  readOnly: { type: Boolean, default: undefined },
  /** Debounce (ms) for `update:modelValue`, `update:text` and `change`. Default `0`. */
  debounce: { type: Number, default: undefined },
  mainMenuBar: { type: Boolean, default: undefined },
  navigationBar: { type: Boolean, default: undefined },
  statusBar: { type: Boolean, default: undefined },
  /** Spaces used for indentation. Default `2`. */
  indentation: { type: Number, default: undefined },
});

const emit = defineEmits([
  "update:modelValue",
  "update:text",
  "update:currentMode",
  "update:fullscreen",
  "change",
  "error",
  "validation-error",
  "mode-change",
  "fullscreen-change",
  "textSelectionChange",
  "selectionChange",
  "colorPicker",
  "focus",
  "blur",
]);

const globalConfig = inject(CONFIG_KEY, {}) || {};
const instance = getCurrentInstance();

const rootRef = ref(null);
const editorRef = ref(null);
const actionsEl = shallowRef(null);
const editorInstance = shallowRef(null);
const ready = ref(false);
const activeMode = ref(null);
const isFullscreen = ref(!!props.fullscreen);
const prefersDark = ref(false);
const htmlTheme = ref(null);

let editor = null;
let internalChange = false;
let debounceTimer = null;
let destroyed = false;
let previousBodyOverflow = null;
let mediaQuery = null;
let htmlObserver = null;

// ------------------------------------------------------------------
// Resolved settings: prop > global config (app.use) > options > default
// ------------------------------------------------------------------

function userOptions() {
  return { ...(globalConfig.options || {}), ...(props.options || {}) };
}

function pick(key, optionKey, fallback) {
  if (props[key] !== undefined) return props[key];
  if (globalConfig[key] !== undefined) return globalConfig[key];
  const opts = userOptions();
  if (optionKey && opts[optionKey] !== undefined) return opts[optionKey];
  return fallback;
}

const resolvedTheme = computed(() => pick("theme", null, "light"));
const resolvedPlus = computed(() => pick("plus", null, true));
const resolvedReadOnly = computed(() => pick("readOnly", null, false));
const resolvedDebounce = computed(() => pick("debounce", null, 0));
const resolvedHeight = computed(() => pick("height", null, undefined));

const effectiveTheme = computed(() => {
  if (resolvedTheme.value !== "auto") return resolvedTheme.value;
  if (htmlTheme.value) return htmlTheme.value;
  return prefersDark.value ? "dark" : "light";
});

const rootClasses = computed(() => [
  "v3-jsoneditor",
  `v3-jsoneditor--${effectiveTheme.value}`,
  {
    "v3-jsoneditor--modern": effectiveTheme.value !== "classic",
    "v3-jsoneditor--fullscreen": isFullscreen.value,
    "v3-jsoneditor--readonly": resolvedReadOnly.value,
  },
]);

const rootStyle = computed(() => {
  const h = resolvedHeight.value;
  if (h === undefined || h === null || h === "") return undefined;
  return { height: typeof h === "number" ? `${h}px` : h };
});

const showFullscreenButton = computed(() => resolvedPlus.value);

function hasListener(name) {
  return Boolean(instance?.vnode.props?.[name]);
}

// ------------------------------------------------------------------
// Editor lifecycle
// ------------------------------------------------------------------

function buildOptions(mode) {
  const user = userOptions();
  const readOnly = resolvedReadOnly.value;

  const options = {
    indentation: 2,
    ...user,
    indentation: pick("indentation", "indentation", 2),
    mode,
    modes: pick("modeList", "modes", ALL_MODES),
    language: pick("language", "language", "en"),
    mainMenuBar: pick("mainMenuBar", "mainMenuBar", true),
    navigationBar: pick("navigationBar", "navigationBar", true),
    statusBar: pick("statusBar", "statusBar", true),
    onChange() {
      userOptions().onChange?.();
      scheduleEmit();
    },
    onModeChange(newMode, oldMode) {
      activeMode.value = newMode;
      attachActions();
      emit("update:currentMode", newMode);
      emit("mode-change", newMode, oldMode);
      nextTick(expandIfTree);
      userOptions().onModeChange?.(newMode, oldMode);
    },
    onValidationError(errors) {
      emit("validation-error", errors);
      userOptions().onValidationError?.(errors);
    },
    onTextSelectionChange(start, end, text) {
      emit("textSelectionChange", editor, start, end, text);
      userOptions().onTextSelectionChange?.(start, end, text);
    },
    onSelectionChange(start, end) {
      emit("selectionChange", editor, start, end);
      userOptions().onSelectionChange?.(start, end);
    },
    onFocus(event) {
      emit("focus", editor, event?.target);
      userOptions().onFocus?.(event);
    },
    onBlur(event) {
      emit("blur", editor, event?.target);
      userOptions().onBlur?.(event);
    },
  };

  // Only replace jsoneditor's built-in color picker when someone handles it.
  if (hasListener("onColorPicker") || typeof user.onColorPicker === "function") {
    options.onColorPicker = (parent, color, onChange) => {
      emit("colorPicker", editor, parent, color, onChange);
      userOptions().onColorPicker?.(parent, color, onChange);
    };
  } else {
    delete options.onColorPicker;
  }

  // Passing `onEditable` disables multi-select in tree mode, so only set it when needed.
  if (readOnly) {
    options.onEditable = () => false;
  } else if (typeof user.onEditable !== "function") {
    delete options.onEditable;
  }

  return options;
}

async function createEditor() {
  // CDN / UMD usage: jsoneditor is loaded as the `JSONEditor` global.
  const globalEditor = typeof window !== "undefined" ? window.JSONEditor : undefined;
  const mod = typeof globalEditor === "function" ? globalEditor : await import("jsoneditor");
  if (destroyed || !editorRef.value) return;
  const JSONEditor = mod.default || mod;

  const mode = pick("currentMode", "mode", "code");
  editor = new JSONEditor(editorRef.value, buildOptions(mode));
  editorInstance.value = editor;
  activeMode.value = editor.getMode();

  if (props.text !== undefined) {
    editor.setText(props.text);
  } else if (props.modelValue !== undefined) {
    editor.set(props.modelValue);
  }

  actionsEl.value = actionsEl.value || document.createElement("div");
  attachActions();
  expandIfTree();
  ready.value = true;
}

function rebuildEditor() {
  if (!editor) return;
  const text = editor.getText();
  const mode = editor.getMode();
  editor.destroy();
  const JSONEditor = editor.constructor;
  editor = new JSONEditor(editorRef.value, buildOptions(mode));
  editorInstance.value = editor;
  editor.setText(text);
  attachActions();
  expandIfTree();
}

/** Put the actions container (fullscreen button + #toolbar slot) into the menu bar. */
function attachActions() {
  const el = actionsEl.value;
  if (!el || !editor) return;
  const menu = editor.menu;
  if (menu) {
    el.className = "v3-jsoneditor__actions";
    menu.appendChild(el);
  } else if (rootRef.value) {
    el.className = "v3-jsoneditor__actions v3-jsoneditor__actions--floating";
    rootRef.value.appendChild(el);
  }
}

function expandIfTree() {
  if (editor && TREE_MODES.includes(editor.getMode())) {
    editor.expandAll();
  }
}

// ------------------------------------------------------------------
// Emitting changes
// ------------------------------------------------------------------

function markInternal() {
  internalChange = true;
  nextTick(() => {
    internalChange = false;
  });
}

function scheduleEmit() {
  const ms = resolvedDebounce.value;
  if (ms > 0) {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(emitChange, ms);
  } else {
    emitChange();
  }
}

function emitChange() {
  debounceTimer = null;
  if (!editor) return;
  const text = editor.getText();
  markInternal();
  emit("update:text", text);

  if (!text.trim()) {
    emit("update:modelValue", null);
    emit("change", null);
    return;
  }

  try {
    const json = editor.get();
    emit("update:modelValue", json);
    emit("change", json);
  } catch (error) {
    emit("error", error);
  }
}

// ------------------------------------------------------------------
// Full screen
// ------------------------------------------------------------------

function lockScroll(lock) {
  if (typeof document === "undefined") return;
  if (lock && previousBodyOverflow === null) {
    previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
  } else if (!lock && previousBodyOverflow !== null) {
    document.body.style.overflow = previousBodyOverflow;
    previousBodyOverflow = null;
  }
}

function onKeydown(event) {
  if (event.key === "Escape" && isFullscreen.value && !event.defaultPrevented) {
    setFullscreen(false);
  }
}

function setFullscreen(value) {
  if (value === isFullscreen.value) return;
  isFullscreen.value = value;
  lockScroll(value);
  if (value) {
    document.addEventListener("keydown", onKeydown);
  } else {
    document.removeEventListener("keydown", onKeydown);
  }
  emit("update:fullscreen", value);
  emit("fullscreen-change", value);
  nextTick(() => {
    editor?.aceEditor?.resize();
    window.dispatchEvent(new Event("resize"));
  });
}

function toggleFullScreen() {
  setFullscreen(!isFullscreen.value);
}

// ------------------------------------------------------------------
// Theme: follow <html class="dark"> or prefers-color-scheme in auto mode
// ------------------------------------------------------------------

function readHtmlTheme() {
  const cl = document.documentElement.classList;
  if (cl.contains("dark")) return "dark";
  if (cl.contains("light")) return "light";
  const attr = document.documentElement.getAttribute("data-theme");
  return attr === "dark" || attr === "light" ? attr : null;
}

function startThemeWatchers() {
  if (typeof window === "undefined") return;
  if (window.matchMedia) {
    mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    prefersDark.value = mediaQuery.matches;
    mediaQuery.addEventListener?.("change", onMediaChange);
  }
  htmlTheme.value = readHtmlTheme();
  htmlObserver = new MutationObserver(() => {
    htmlTheme.value = readHtmlTheme();
  });
  htmlObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class", "data-theme"],
  });
}

function onMediaChange(event) {
  prefersDark.value = event.matches;
}

// ------------------------------------------------------------------
// Watchers
// ------------------------------------------------------------------

watch(
  () => props.modelValue,
  (value) => {
    if (internalChange || !editor || value === undefined) return;
    if (props.text !== undefined && hasListener("onUpdate:text") && !hasListener("onUpdate:modelValue")) return;
    try {
      editor.update(value);
    } catch (error) {
      editor.set(value);
    }
    nextTick(expandIfTree);
  },
  { deep: true }
);

watch(
  () => props.text,
  (value) => {
    if (internalChange || !editor || value === undefined) return;
    if (value !== editor.getText()) {
      editor.updateText(value);
      nextTick(expandIfTree);
    }
  }
);

watch(
  () => props.currentMode,
  (mode) => {
    if (mode && editor && mode !== editor.getMode()) {
      editor.setMode(mode);
    }
  }
);

watch(
  () => props.fullscreen,
  (value) => {
    if (value !== undefined) setFullscreen(value);
  }
);

watch(
  () => props.options?.schema,
  (schema) => {
    if (editor) editor.setSchema(schema, props.options?.schemaRefs);
  }
);

watch(
  () => [
    pick("language", "language", "en"),
    JSON.stringify(pick("modeList", "modes", ALL_MODES)),
    pick("mainMenuBar", "mainMenuBar", true),
    pick("navigationBar", "navigationBar", true),
    pick("statusBar", "statusBar", true),
    pick("indentation", "indentation", 2),
    resolvedReadOnly.value,
  ],
  (next, prev) => {
    if (next.some((v, i) => v !== prev[i])) rebuildEditor();
  }
);

// ------------------------------------------------------------------
// Mount / unmount
// ------------------------------------------------------------------

onMounted(() => {
  startThemeWatchers();
  createEditor().catch((error) => emit("error", error));
  if (isFullscreen.value) {
    lockScroll(true);
    document.addEventListener("keydown", onKeydown);
  }
});

onBeforeUnmount(() => {
  destroyed = true;
  clearTimeout(debounceTimer);
  lockScroll(false);
  if (typeof document !== "undefined") {
    document.removeEventListener("keydown", onKeydown);
  }
  mediaQuery?.removeEventListener?.("change", onMediaChange);
  htmlObserver?.disconnect();
  actionsEl.value?.remove();
  editor?.destroy();
  editor = null;
  editorInstance.value = null;
});

// ------------------------------------------------------------------
// Public API (template ref)
// ------------------------------------------------------------------

function setEditorContent(value) {
  if (!editor) return;
  editor.set(value);
  nextTick(expandIfTree);
}

function expandAll() {
  expandIfTree();
}

function collapseAll() {
  if (editor && TREE_MODES.includes(editor.getMode())) {
    editor.collapseAll();
  }
}

defineExpose({
  getEditor: () => editor,
  get: () => editor?.get(),
  getText: () => (editor ? editor.getText() : ""),
  validate: () => (editor ? Promise.resolve(editor.validate()) : Promise.resolve([])),
  focus: () => editor?.focus(),
  setEditorContent,
  expandAll,
  collapseAll,
  toggleFullScreen,
});
</script>
