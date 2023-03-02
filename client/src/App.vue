<template>
  <NavTopBar/>
  <div id="content-container" v-if="kcStore.authenticated === authenticatedState">
    <div id="content">
      <RouterView/>
    </div>
  </div>
  <div id="login" v-else-if="kcStore.authenticated === unauthenticatedState">
    <b-card header="Bitte melde dich an">
      <b-button variant="primary" class="w-100" @click="login">Educorvi SSO</b-button>
    </b-card>
  </div>
  <customSpinner v-else/>
</template>

<script lang="ts" setup>
import {RouterView} from 'vue-router'
import NavTopBar from "@/components/NavTopBar.vue";
import Keycloak from "keycloak-js";
import {authState, useKeycloakStore} from "@/stores/keycloak";
import CustomSpinner from "@/components/CustomSpinner.vue";
import {BCard, BButton} from "bootstrap-vue";
import {computed} from "vue";

const kcStore = useKeycloakStore();

let keycloak = new Keycloak({
  url: import.meta.env.VITE_KC_URL,
  realm: import.meta.env.VITE_KC_REALM,
  clientId: import.meta.env.VITE_KC_CLIENTID
})

kcStore.setKeycloak(keycloak);

keycloak.init({
  onLoad: 'check-sso',
  silentCheckSsoRedirectUri: window.location.origin + '/auth.html'
}).then(auth => {
  if (auth) {
    kcStore.setAuthenticated(authState.authenticated);
  } else {
    kcStore.setAuthenticated(authState.unauthenticated);
  }
});

function login() {
  keycloak.login({scope: ["openid", "profile", "email"].join(" ")})
}


const authenticatedState = computed(() => authState.authenticated);
const unauthenticatedState = computed(() => authState.unauthenticated);
</script>

<style scoped>
#content-container {
  width: 100%;
  display: flex;
  justify-content: center;
}
#content {
  padding: 10px;
  max-width: 800px;
  width: 100%;
}

#login{
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -100px;
  margin-left: -100px;
  width: 200px;
  height: 200px;
}
</style>
