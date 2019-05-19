// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import Chartist from 'chartist';
import App from './App.vue';

// router setup
import router from './router';

// Plugins
import GlobalComponents from './globalComponents';
import GlobalDirectives from './globalDirectives';
import Notifications from './components/NotificationPlugin';

// MaterialDashboard plugin
import MaterialDashboard from './material-dashboard';

Vue.prototype.$Chartist = Chartist;

Vue.use(MaterialDashboard);
Vue.use(GlobalComponents);
Vue.use(GlobalDirectives);
Vue.use(Notifications);

Vue.config.productionTip = false;


new Vue({
  router,
  render: h => h(App),
  data: {
    Chartist,
  },
}).$mount('#app');
