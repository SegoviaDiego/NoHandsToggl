<template>
  <div class="wrapper" :class="{ 'nav-open': $sidebar.showSidebar }">
    <side-bar>
      <mobile-menu slot="content"></mobile-menu>
      <sidebar-link to="/dashboard">
        <md-icon>dashboard</md-icon>
        <p>Dashboard</p>
      </sidebar-link>
      <sidebar-link to="/settings">
        <md-icon>settings</md-icon>
        <p>Settings</p>
      </sidebar-link>
    </side-bar>

    <div class="main-panel">
      <top-navbar></top-navbar>

      <dashboard-content> </dashboard-content>
    </div>
  </div>
</template>
<style lang="scss"></style>
<script>
import TopNavbar from './TopNavbar.vue';
import DashboardContent from './Content.vue';
import MobileMenu from '@/pages/Layout/MobileMenu.vue';

export default {
  components: {
    TopNavbar,
    DashboardContent,
    MobileMenu,
  },
};
</script>
