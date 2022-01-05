import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import HangarUploader from '../packages/index';
import '../packages/lazy_use';

Vue.use(HangarUploader);
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
