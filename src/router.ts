import Vue from 'vue';
import Router from 'vue-router';
import ElectronStore from 'electron-store';
import axios from 'axios'

Vue.use(Router);

const store = new ElectronStore();

const router = new Router({
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import(/* webpackChunkName: "login" */ './views/Login.vue'),
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import(/* webpackChunkName: "dashboard" */ './views/Dashboard.vue'),
    },
    {
      path: '*',
      redirect: '/login'
    }
  ],
});

router.beforeEach((to, from, next)=>{
  if(to.fullPath !== '/login' && !store.get('TOGGL_APITOKEN')) next('/login');
  else if(store.get('TOGGL_APITOKEN') && !axios.defaults.auth)
    axios.defaults.auth = {
      username: `${store.get('TOGGL_APITOKEN')}`,
      password: 'api_token'
    }
  next();
})

export default router;
