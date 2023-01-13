<template>
  <NavTopBar/>
  <div id="content" v-if="authenticated === authenticatedState">
    <RouterView/>
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

export default {
  components: {CustomSpinner, NavTopBar, RouterView},
  methods: {
    receiveMessage(event: any) {
      console.log(event);
    },
    login() {
      this.keycloak.login()
    },
    ...mapActions(useKeycloakStore, ["setKeycloak", "setAuthenticated"])
  },
  mounted () {
    let keycloak = new Keycloak({
      url: "https://sso.educorvi.de",
      realm: "educorvi",
      clientId: "timeclicker"
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
      console.log(keycloak);

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
#content {
  padding: 10px;
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
