# v3-jsoneditor

> "Vue 3 JSON Editor" is a web-based application built with the Vue 3 JavaScript framework that allows users to easily create, view, and edit JSON data in a user-friendly interface.

## Try the demo

https://v3-jsoneditor.netlify.app/

## Installation

```bash
npm install v3-jsoneditor
```

## Using

### Import globally

```javascript
import {createApp} from 'vue'
import App from './App.vue'
import Vue3Jsoneditor from 'v3-jsoneditor/src/Vue3Jsoneditor.vue'

const app = createApp(App)

// Register the VJsoneditor component globally
app.component('vue3-jsoneditor', Vue3Jsoneditor)

app.mount('#app')
```

### Import

```javascript
import Vue3Jsoneditor from 'v3-jsoneditor/src/Vue3Jsoneditor.vue'

export default {
    name: 'app',
    components: {
        Vue3Jsoneditor
    },
    data() {
        return {
            json: {
                "hello": "vue"
            }
        }
    },
}
```

```html
<Vue3Jsoneditor ref="editor" v-model="json" :options="options"></Vue3Jsoneditor>
```

### Options

| Name          | Description                                                                                                                                                   | type    | default          |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-----: | :--------------: |
| options       | Jsoneditor params, You can look at the detailed  [configuration](https://github.com/josdejong/jsoneditor/blob/master/docs/api.md#configuration-options?blank) | Object  | { mode: 'code' } |
| v-model | Object value                                                                                                                                                  | Object  | { }              |
| currentMode          | current edit mode	                                                                                                                       | String | code             |
| height        | Default height                                                                                                                                                | String  | -                |

### Events

| Name               | Description                  |
|--------------------|------------------------------|
| change             | called on json update        |
| update:modelValue	 | Called on model value update |
| error	             | Error callback |


# Support

If this helped you in any way, you can contribute to this project for long term survival by supporting me

### [💜 Support my open-source work on GitHub](https://github.com/sponsors/pratik227)

Be sure to check out my sponsor page.

Thank you so much!!!

# License

MIT
