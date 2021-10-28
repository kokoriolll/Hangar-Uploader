import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    redirect: '/code'
  },
  {
    path: '/code',
    name: 'code',
    component: () => import('../views/code/code')
  }
];

const router = new VueRouter({
  routes
});

export default router;
