<script setup>
import { ref } from 'vue';

const json = ref({ name: 'v3-jsoneditor', version: 1, tags: ['vue', 'json'], active: true, owner: null });
const mode = ref('tree');
const theme = ref('light');
const fullscreen = ref(false);
const readOnly = ref(false);
const log = ref([]);
const editor = ref(null);
const push = (name, payload) => log.value.unshift(`${name}: ${JSON.stringify(payload)}`.slice(0, 120));
const toggleDark = () => document.documentElement.classList.toggle('dark');
const schema = { type: 'object', properties: { version: { type: 'number' } }, required: ['name'] };
</script>

<template>
  <div class="bar">
    <select v-model="theme" data-test="theme">
      <option>light</option><option>dark</option><option>auto</option><option>classic</option>
    </select>
    <select v-model="mode" data-test="mode">
      <option>tree</option><option>code</option><option>form</option><option>text</option><option>view</option>
    </select>
    <button data-test="html-dark" @click="toggleDark">toggle html.dark</button>
    <button data-test="readonly" @click="readOnly = !readOnly">readOnly: {{ readOnly }}</button>
    <button data-test="set" @click="json = { replaced: true, n: Math.random() }">replace model</button>
    <button data-test="collapse" @click="editor.collapseAll()">collapseAll</button>
  </div>
  <div class="grid">
    <Vue3Jsoneditor
      ref="editor"
      v-model="json"
      v-model:current-mode="mode"
      v-model:fullscreen="fullscreen"
      :theme="theme"
      :read-only="readOnly"
      :options="{ schema, onChange: () => push('options.onChange', true) }"
      height="420px"
      @mode-change="(n, o) => push('mode-change', [n, o])"
      @validation-error="(e) => push('validation-error', e.length)"
      @fullscreen-change="(v) => push('fullscreen-change', v)"
      @error="(e) => push('error', e.message)"
    >
      <template #toolbar="{ mode: m }">
        <button class="v3-jsoneditor__btn v3-jsoneditor__btn--label" data-test="custom-btn" @click="push('custom', m)">Copy</button>
      </template>
    </Vue3Jsoneditor>
    <div>
      <p>mode: <b data-test="mode-out">{{ mode }}</b> · fullscreen: {{ fullscreen }}</p>
      <pre data-test="model">{{ json }}</pre>
      <pre data-test="log">{{ log.join('\n') }}</pre>
    </div>
  </div>
  <h3>Second instance (dark, no main menu)</h3>
  <Vue3Jsoneditor v-model="json" theme="dark" :main-menu-bar="false" current-mode="code" height="220px" />
</template>
