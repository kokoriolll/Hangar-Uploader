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
        value: '[{"id":"1","name":"123.pdf"}]'
      };
    },
    mounted() {
      /* setTimeout(() => {
        this.value = '[{"id":"1","name":"123.pdf"}]';
      }, 600); */
    }
  };
</script>

<style scoped>

</style>
