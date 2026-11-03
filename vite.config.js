import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { libInjectCss } from 'vite-plugin-lib-inject-css';
import { fileURLToPath } from 'node:url';

/**
 * Library mode inlines every asset, and jsoneditor's CSS references its 31 KB icon
 * sprite in ~12 rules. Point those rules at one custom property so the sprite is
 * embedded once.
 */
function dedupeJsoneditorSprite() {
  const re = /url\((['\"]?)\.\/img\/jsoneditor-icons\.svg\1\)/g;
  return {
    name: 'v3-jsoneditor:dedupe-sprite',
    enforce: 'pre',
    transform(code, id) {
      if (!/jsoneditor(\.min)?\.css(\?|$)/.test(id)) return null;
      return {
        code: code.replace(re, 'var(--vje-jsoneditor-sprite)') +
          '\n:root{--vje-jsoneditor-sprite:url("./img/jsoneditor-icons.svg")}\n',
        map: null,
      };
    },
  };
}

export default defineConfig({
  plugins: [dedupeJsoneditorSprite(), vue(), libInjectCss()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  build: {
    cssCodeSplit: false,
    sourcemap: true,
    lib: {
      entry: fileURLToPath(new URL('./index.js', import.meta.url)),
      name: 'Vue3Jsoneditor',
      fileName: 'v3-jsoneditor',
      cssFileName: 'style',
      formats: ['es', 'umd'],
    },
    rollupOptions: {
      external: ['vue', 'jsoneditor'],
      output: {
        exports: 'named',
        globals: { vue: 'Vue', jsoneditor: 'JSONEditor' },
        assetFileNames: (info) => (info.names?.[0]?.endsWith('.css') ? 'style.css' : 'assets/[name][extname]'),
      },
    },
  },
});
