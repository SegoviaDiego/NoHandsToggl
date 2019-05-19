import Vue from 'vue';
import VueRouter from 'vue-router';
import routes from './routes/routes';

Vue.use(VueRouter);

const router = new VueRouter({
  routes,
  linkExactActiveClass: 'nav-item active',
});

export default router;
