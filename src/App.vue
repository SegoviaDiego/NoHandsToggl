<template>
  <div id="app">
    <time-entry-loop v-if="settings" />
    <router-view/>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { ipcRenderer, app } from 'electron';
import axios from 'axios';
import TimeEntryLoop from '@/pages/TimeEntryLoop.vue';
import dbService from '@/database/dbService';
import { first } from 'rxjs/operators';

@Component({
  components: {
    TimeEntryLoop
  }
})
export default class App extends Vue {
  settings: any = null;

  async created(){
    this.awaitForSettingsLoop();
  }

  async awaitForSettingsLoop(){
    dbService.getSettings().pipe( first() )
      .subscribe((settings: any = {}) => {
        if(settings && settings.token){
          this.settings = settings;
          axios.defaults.auth = {
            username: `${settings.token}`,
            password: 'api_token',
          };
        } else {
          setTimeout(()=>{
            this.awaitForSettingsLoop();
          }, 1000);
        }
      });
  }
}
</script>

<style lang="scss">
@import "~vue-material/dist/theme/engine"; // Import the theme engine
@import "~vue-material/dist/theme/all"; // Apply the theme

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
