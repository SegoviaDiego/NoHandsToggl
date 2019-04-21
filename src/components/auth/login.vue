<template>
  <div class="hello">
    <h1>Login</h1>
    <input type="text" placeholder="Toggl API Token" v-model="token"> 
    <button v-on:click="login">Login</button>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import axios from 'axios';
import ElectronStore from 'electron-store';

const store = new ElectronStore();

@Component
export default class Login extends Vue {
  token: any = store.get('TOGGL_APITOKEN') || '';

  created(){
    if(store.get('TOGGL_APITOKEN')) {
      this.token = store.get('TOGGL_APITOKEN');
      this.login();
    }
  }

  login(){
    axios.get('https://www.toggl.com/api/v8/me', {
      auth: {
        username: this.token,
        password: 'api_token'
      }
    }).then(()=>{
      axios.defaults.auth = {
        username: this.token,
        password: 'api_token'
      }
      this.$router.push('dashboard');
      store.set('TOGGL_APITOKEN', this.token);
    }).catch((err)=>{
      //TODO: Show error to the user
    })
  }
}
</script>

<style scoped lang="scss">
</style>
