<template>
  <div>
    <hangar-uploader text="qwe" :value="value"/>
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
        this.value = '[{"id":"269BBE73-A3DA-DA11-598D-438DEF04E425","name":"报批申请表迁西福报批申请表迁西福珍全大洪峪铁矿9珍全大洪峪铁矿9.6.pdf"}]';
      }, 600);
    }
  };
</script>

<style scoped>

</style>
