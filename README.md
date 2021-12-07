# hangar-uploader 一款基于vue-simple-uploader的上传插件

## 简介
本项目基于vue-simple-uploader，在此基础上添加了文件的MD5验证和PDF在线预览的功能，该插件需要后台配合使用
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

## 安装依赖
```
npm install
```

### 启动项目
```
npm run serve
```
