/** Injection key for global defaults registered through `app.use(Vue3Jsoneditor, { ... })`. */
export const CONFIG_KEY = Symbol.for('v3-jsoneditor:config');

export const ALL_MODES = ['tree', 'code', 'form', 'text', 'view'];

/** Modes rendered as a tree (support expandAll / collapseAll). */
export const TREE_MODES = ['tree', 'view', 'form'];

export const THEMES = ['light', 'dark', 'auto', 'classic'];
