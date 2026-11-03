import type { App, DefineComponent, InjectionKey, Plugin } from 'vue';

/** Any JSON value. */
export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

/** Editing modes provided by jsoneditor. */
export type EditorMode = 'tree' | 'code' | 'form' | 'text' | 'view';

/**
 * Visual theme.
 * - `light`: modern light look (default)
 * - `dark`: modern dark look
 * - `auto`: follows `<html class="dark">` / `data-theme`, then `prefers-color-scheme`
 * - `classic`: the original jsoneditor look (blue menu bar)
 */
export type EditorTheme = 'light' | 'dark' | 'auto' | 'classic';

/** Built-in UI languages of jsoneditor. Custom ones can be added via `options.languages`. */
export type EditorLanguage =
  | 'en'
  | 'zh-CN'
  | 'pt-BR'
  | 'tr'
  | 'ja'
  | 'fr-FR'
  | 'de'
  | 'ru'
  | 'es'
  | (string & {});

/**
 * jsoneditor constructor options, passed through untouched.
 * See https://github.com/josdejong/jsoneditor/blob/master/docs/api.md#configuration-options
 */
export interface JsonEditorOptions {
  mode?: EditorMode;
  modes?: EditorMode[];
  schema?: object;
  schemaRefs?: Record<string, object>;
  indentation?: number;
  language?: string;
  languages?: Record<string, Record<string, string>>;
  mainMenuBar?: boolean;
  navigationBar?: boolean;
  statusBar?: boolean;
  search?: boolean;
  history?: boolean;
  name?: string;
  theme?: string;
  enableSort?: boolean;
  enableTransform?: boolean;
  escapeUnicode?: boolean;
  sortObjectKeys?: boolean;
  limitDragging?: boolean;
  maxVisibleChilds?: number;
  onChange?: () => void;
  onChangeJSON?: (json: JsonValue) => void;
  onChangeText?: (text: string) => void;
  onValidate?: (json: JsonValue) => unknown[] | Promise<unknown[]>;
  onValidationError?: (errors: unknown[]) => void;
  onEditable?: (node: unknown) => boolean | { field: boolean; value: boolean };
  onError?: (error: Error) => void;
  onModeChange?: (newMode: EditorMode, oldMode: EditorMode) => void;
  onFocus?: (event: { type: string; target: HTMLElement }) => void;
  onBlur?: (event: { type: string; target: HTMLElement }) => void;
  onColorPicker?: (parent: HTMLElement, color: string, onChange: (color: string) => void) => void;
  [key: string]: unknown;
}

/** Minimal shape of the underlying jsoneditor instance returned by `getEditor()`. */
export interface JSONEditorInstance {
  get(): JsonValue;
  set(json: JsonValue): void;
  update(json: JsonValue): void;
  getText(): string;
  setText(text: string): void;
  updateText(text: string): void;
  getMode(): EditorMode;
  setMode(mode: EditorMode): void;
  setSchema(schema: object | null, schemaRefs?: Record<string, object>): void;
  expandAll(): void;
  collapseAll(): void;
  focus(): void;
  validate(): Promise<unknown[]>;
  destroy(): void;
  [key: string]: unknown;
}

export interface Vue3JsoneditorProps {
  /** Bound JSON value (`v-model`). Any JSON value. */
  modelValue?: JsonValue;
  /** Raw editor text (`v-model:text`); may be invalid JSON while the user types. */
  text?: string;
  /** jsoneditor options, passed through. Your callbacks run in addition to the component's own. */
  options?: JsonEditorOptions;
  /** Active mode (`v-model:currentMode`). @default 'code' */
  currentMode?: EditorMode;
  /** Modes offered in the mode switcher. @default ['tree','code','form','text','view'] */
  modeList?: EditorMode[];
  /** UI language. @default 'en' */
  language?: EditorLanguage;
  /** Editor height; numbers are pixels. @default '400px' */
  height?: string | number;
  /** Show the full screen button. @default true */
  plus?: boolean;
  /** Full screen state (`v-model:fullscreen`). @default false */
  fullscreen?: boolean;
  /** Visual theme. @default 'light' */
  theme?: EditorTheme;
  /** Read-only in every mode. @default false */
  readOnly?: boolean;
  /** Debounce (ms) for model updates and `change`. @default 0 */
  debounce?: number;
  /** @default true */
  mainMenuBar?: boolean;
  /** @default true */
  navigationBar?: boolean;
  /** @default true */
  statusBar?: boolean;
  /** Spaces used for indentation. @default 2 */
  indentation?: number;
}

export interface Vue3JsoneditorEmits {
  'update:modelValue': (value: JsonValue) => void;
  'update:text': (text: string) => void;
  'update:currentMode': (mode: EditorMode) => void;
  'update:fullscreen': (value: boolean) => void;
  change: (value: JsonValue) => void;
  /** Emitted when the editor text is not valid JSON. */
  error: (error: Error) => void;
  /** Emitted whenever the set of schema / custom validation errors changes. */
  'validation-error': (errors: unknown[]) => void;
  'mode-change': (newMode: EditorMode, oldMode: EditorMode) => void;
  'fullscreen-change': (value: boolean) => void;
  focus: (editor: JSONEditorInstance, target: HTMLElement) => void;
  blur: (editor: JSONEditorInstance, target: HTMLElement) => void;
  textSelectionChange: (editor: JSONEditorInstance, start: unknown, end: unknown, text: string) => void;
  selectionChange: (editor: JSONEditorInstance, start: unknown, end: unknown) => void;
  colorPicker: (
    editor: JSONEditorInstance,
    parent: HTMLElement,
    color: string,
    onChange: (color: string) => void,
  ) => void;
}

/** Methods available through a template ref. */
export interface Vue3JsoneditorExpose {
  /** The raw jsoneditor instance, or `null` before mount. */
  getEditor(): JSONEditorInstance | null;
  /** Parsed JSON. Throws when the text is invalid. */
  get(): JsonValue | undefined;
  getText(): string;
  validate(): Promise<unknown[]>;
  focus(): void;
  setEditorContent(value: JsonValue): void;
  expandAll(): void;
  collapseAll(): void;
  toggleFullScreen(): void;
}

export interface Vue3JsoneditorSlots {
  /** Placeholder shown until the editor has mounted. */
  default?: () => unknown;
  /** Extra controls rendered inside the editor's menu bar. */
  toolbar?: (props: { editor: JSONEditorInstance | null; mode: EditorMode | null }) => unknown;
}

export type Vue3JsoneditorComponent = DefineComponent<Vue3JsoneditorProps> & {
  new (): { $slots: Vue3JsoneditorSlots } & Vue3JsoneditorExpose;
  install: (app: App, config?: Vue3JsoneditorConfig) => void;
};

/** Global defaults for `app.use(Vue3Jsoneditor, config)`. */
export interface Vue3JsoneditorConfig extends Omit<Vue3JsoneditorProps, 'modelValue' | 'text' | 'fullscreen'> {
  /** Name used for global registration. @default 'Vue3Jsoneditor' */
  componentName?: string;
}

declare const Vue3Jsoneditor: Vue3JsoneditorComponent & Plugin<[Vue3JsoneditorConfig?]>;

export declare function install(app: App, config?: Vue3JsoneditorConfig): void;
export declare const CONFIG_KEY: InjectionKey<Vue3JsoneditorConfig>;
export { Vue3Jsoneditor };
export default Vue3Jsoneditor;

declare module 'vue' {
  interface GlobalComponents {
    Vue3Jsoneditor: typeof Vue3Jsoneditor;
  }
}
