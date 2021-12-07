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
    },
    mounted() {
      setTimeout(() => {
        this.value = '[{"id":"1","name":"陈老师摄影教学.pdf"}]';
      }, 600);
    }
  };
</script>

<style scoped>

</style>
