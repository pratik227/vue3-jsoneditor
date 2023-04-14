import Vue3Jsoneditor from './src/Vue3Jsoneditor.vue';

export default Vue3Jsoneditor;

export const install = (app) => {
    app.component(Vue3Jsoneditor.name, Vue3Jsoneditor);
};

if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue);
}
