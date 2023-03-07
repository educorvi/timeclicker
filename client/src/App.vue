<template>
  <NavTopBar/>
  <div id="alerts">
    <TransitionGroup name="list" class="alertlist">
      <b-alert :key="error" v-for="(error) in errorStore.errors" show variant="danger" class="m-2">
        <div style="display: flex; justify-content: space-between; align-items: center">
          <p class="m-0" style="height: min-content">{{ t('error') }}: {{ error.message }}</p>
          <BButton @click="errorStore.removeError(error)" variant="outline-light" style="width: 50px">
            <b-icon-x/>
          </BButton>
        </div>
      </b-alert>
    </TransitionGroup>
  </div>
  <div id="content-container" v-if="kcStore.authenticated === authenticatedState">
    <div id="content">
      <RouterView/>
    </div>
  </div>
  <div id="login" v-else-if="kcStore.authenticated === unauthenticatedState">
    <b-card :header="t('login_prompt')">
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
import {BCard, BButton, BAlert, BIconX} from "bootstrap-vue";
import {computed} from "vue";
import {useErrorStore} from "@/stores/error";
import {useI18n} from "vue-i18n";

const kcStore = useKeycloakStore();
const errorStore = useErrorStore();

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

const {t} = useI18n();

</script>

<style scoped>
#alerts {
  position: absolute;
  width: 100%;

  z-index: 10000;
}

#content-container {
  width: 100%;
  display: flex;
  justify-content: center;
}

#content {
  padding: 10px;
  max-width: 1300px;
  width: 100%;
}

#login {
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -100px;
  margin-left: -100px;
  width: 200px;
  height: 200px;
}
</style>

<style>
.alertlist {
  display: block;
}

.list-move, /* apply transition to moving elements */
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px) scaleY(0);
}

/* ensure leaving items are taken out of layout flow so that moving
   animations can be calculated correctly. */
.list-leave-active {
  position: absolute;
}
</style>
