# hangar-uploader 一款基于vue-simple-uploader的上传插件

## 简介
本项目基于vue-simple-uploader，在此基础上添加了文件的MD5验证、图片在线预览和PDF在线预览的功能，该插件需要后台配合使用
注：本项目不兼容VUE3.0项目

## 引入组件

``` javascript
// 在main.js引入
import HangarUploader from 'hangar-uploader';
import uploader from 'vue-simple-uploader';
Vue.use(uploader);
Vue.use(HangarUploader);
```

## 使用组件

```html
<template>
  <div>
    <hangar-uploader text="文件上传" :value="value"/>
  </div>
</template>

<script>
  export default {
    name: 'Code',
    data() {
      return {
        value: ''
      };
    }
  };
</script>

<style scoped>

</style>

```

## Attributes

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| ---- | ---- | ---- | ---- | ---- |
| disabled | 是否启用上传按钮 | Boolean | true / false | false |
| text | 上传组件标题 | String | - | - |
| value(v-model) | 上传的文件 | String | - | - |
| uploadOptions | 上传器的配置（具体参考）vue-simple-uploader | Object | - | - |
| fileNumber | 上传文件个数 | Number | - | 2 |
| attrs | 上传文件的类型 | Object | - | - |

## 安装依赖
```
npm install
```

### 启动项目
```
npm run serve
```
