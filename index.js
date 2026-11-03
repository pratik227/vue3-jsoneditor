import Vue3Jsoneditor from './src/Vue3Jsoneditor.vue';
import { CONFIG_KEY } from './src/config.js';

/**
 * Vue plugin: registers the component globally and sets global defaults.
 *
 *   app.use(Vue3Jsoneditor, { componentName: 'JsonEditor', theme: 'auto', options: {} })
 *
 * Every key except `componentName` is used as a default for the prop with the same name.
 */
export function install(app, config = {}) {
    const { componentName = 'Vue3Jsoneditor', ...defaults } = config || {};
    app.provide(CONFIG_KEY, defaults);
    app.component(componentName, Vue3Jsoneditor);
}

Vue3Jsoneditor.install = install;

export { Vue3Jsoneditor, CONFIG_KEY };
export default Vue3Jsoneditor;
