<template>
  <NavTopBar/>
  <div id="content-container" v-if="authenticated === authenticatedState">
    <div id="content">
      <RouterView/>
    </div>
  </div>
  <div id="login" v-else-if="authenticated === unauthenticatedState">
    <b-card header="Bitte melde dich an">
      <b-button variant="primary" class="w-100" @click="login">Educorvi SSO</b-button>
    </b-card>
  </div>
  <customSpinner v-else/>
</template>

<script lang="ts">
import {RouterView} from 'vue-router'
import NavTopBar from "@/components/NavTopBar.vue";
import Keycloak from "keycloak-js";
import {mapActions, mapState} from "pinia";
import {authState, useKeycloakStore} from "@/stores/keycloak";
import CustomSpinner from "@/CustomSpinner.vue";
import {BCard, BButton} from "bootstrap-vue";

export default {
  components: {CustomSpinner, NavTopBar, RouterView, BCard, BButton},
  methods: {
    login() {
      this.keycloak?.login({scope: ["openid", "profile", "email"].join(" ")})
    },
    ...mapActions(useKeycloakStore, ["setKeycloak", "setAuthenticated"])
  },
  mounted () {
    let keycloak = new Keycloak({
      url: import.meta.env.VITE_KC_URL,
      realm: import.meta.env.VITE_KC_REALM,
      clientId: import.meta.env.VITE_KC_CLIENTID
    })

    this.setKeycloak(keycloak);

    keycloak.init({
      onLoad: 'check-sso',
      silentCheckSsoRedirectUri: window.location.origin + 'auth.html'
    }).then(auth => {
      console.log(auth)
      if (auth) {
        this.setAuthenticated(authState.authenticated);
      } else {
        this.setAuthenticated(authState.unauthenticated);
      }
    });

  },
  computed: {
    ...mapState(useKeycloakStore, ["authenticated", "keycloak"]),
    authenticatedState() {
      return authState.authenticated;
    },
    unauthenticatedState() {
      return authState.unauthenticated;
    },
  }
}
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
