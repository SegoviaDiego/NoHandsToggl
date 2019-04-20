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

@Component
export default class Login extends Vue {
  token: string = '';

  login(){
    axios.get('https://www.toggl.com/api/v8/me', {
      auth: {
        username: this.token,
        password: 'api_token'
      }
    }).then((response)=>{
      //TODO: Navigate to dashboard
      console.log(response);
    }).catch((err)=>{
      //TODO: Show error to the user
    })
  }
}
</script>

<style scoped lang="scss">
</style>
