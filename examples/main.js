import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import HangarUploader from '../packages/index';
import uploader from 'vue-simple-uploader';

Vue.use(HangarUploader);
Vue.use(uploader);
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
