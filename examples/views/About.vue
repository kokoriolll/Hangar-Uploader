<template>
  <div class="about">
    <h1>This is an about page</h1>
    <a-input v-model.trim="text" style="width: 160px;"/>
    <a-button @click="submit" type="primary">Submit!</a-button>
    <hangar-uploader/>
  </div>
</template>

<script>
export default {
  name: 'About',
  data() {
    return {
      text: ''
    };
  },
  methods: {
    submit() {
      console.log(this.text);
    }
  }
};
</script>

<style scoped>

</style>
