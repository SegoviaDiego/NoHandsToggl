<template>
  <div class="grid">
    <LoginComponent/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import LoginComponent from '@/components/auth/login.vue'; // @ is an alias to /src

@Component({
  components: {
    LoginComponent,
  },
})
export default class Login extends Vue {}
</script>
