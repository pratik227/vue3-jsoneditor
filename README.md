# vue3-jsoneditor

> Vue 3 JSONEditor

## Try the demo

## Installation

```bash
npm install vue3-jsoneditor
```

## Using

### Import globally

```javascript
import {createApp} from 'vue'
import App from './App.vue'
import Vue3Jsoneditor from 'Vue3Jsoneditor'

const app = createApp(App)

// Register the VJsoneditor component globally
app.component('vue3-jsoneditor', Vue3Jsoneditor)

app.mount('#app')
```

### Import

```javascript
import Vue3Jsoneditor from 'vue3-jsoneditor'

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

| Name           | Description                                                                                                                                                   | type    | default          |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-----: | :--------------: |
| options        | Jsoneditor params, You can look at the detailed  [configuration](https://github.com/josdejong/jsoneditor/blob/master/docs/api.md#configuration-options?blank) | Object  | { mode: 'code' } |
| value(v-model) | Object value                                                                                                                                                  | Object  | { }              |
| plus           | Whether full screen switching is added                                                                                                                        | Boolean | true             |
| height         | Default height                                                                                                                                                | String  | -                |

### Events

| Name  | Description    |
| ----- | -------------- |
| error | Error callback |
