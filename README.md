# v3-jsoneditor

> "Vue 3 JSON Editor" is a web-based application built with the Vue 3 JavaScript framework that allows users to easily create, view, and edit JSON data in a user-friendly interface. With its intuitive drag-and-drop functionality and syntax highlighting, this editor simplifies the process of working with JSON data.

## Try the demo

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
    methods: {
        onError() {
            console.log('error')
        }
    }
}
```

### Options

| Name          | Description                                                                                                                                                   | type    | default          |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-----: | :--------------: |
| options       | Jsoneditor params, You can look at the detailed  [configuration](https://github.com/josdejong/jsoneditor/blob/master/docs/api.md#configuration-options?blank) | Object  | { mode: 'code' } |
| v-model | Object value                                                                                                                                                  | Object  | { }              |
| plus          | Whether full screen switching is added                                                                                                                        | Boolean | true             |
| height        | Default height                                                                                                                                                | String  | -                |

### Events

| Name  | Description    |
| ----- | -------------- |
| error | Error callback |
