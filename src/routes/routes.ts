import DashboardLayout from '@/pages/Layout/DashboardLayout.vue';

import Dashboard from '@/pages/Dashboard.vue';
import Settings from '@/pages/Settings.vue';

const routes = [
  // {
  //   path: '/login',
  //   name: 'login',
  //   component: () => import(/* webpackChunkName: "login" */ './views/Login.vue'),
  // },
  // {
  //   path: '/dashboard',
  //   name: 'dashboard',
  //   component: () => import(/* webpackChunkName: "dashboard" */ './views/Dashboard.vue'),
  // },
  // {
  //   path: '*',
  //   redirect: '/login'
  // },
  {
    path: '/',
    component: DashboardLayout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: Dashboard,
      },
      {
        path: 'settings',
        name: 'Settings',
        component: Settings,
      },
    ],
  },
  {
    path: '*',
    redirect: '/dashboard'
  },
];

export default routes;
