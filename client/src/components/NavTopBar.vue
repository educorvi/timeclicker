<template>
  <b-navbar id="navbar" variant="light">
    <b-navbar-brand>
      <clock-solid style="width: 35px"/> TimeClicker
    </b-navbar-brand>
    <!--      <h6 style="color: black">v{{version}}</h6>-->
    <b-navbar-nav class="ml-auto">
      <b-nav-item-dropdown :text="userdata.firstName+' '+userdata.lastName" right v-if="userdata">
<!--        <b-dropdown-item :href="userdata.accURL">Account</b-dropdown-item>-->
        <b-dropdown-item :href="keycloak.createLogoutUrl()">Logout</b-dropdown-item>
      </b-nav-item-dropdown>
    </b-navbar-nav>
  </b-navbar>
</template>

<script>
import ClockSolid from "@/components/icons/clock-solid.vue";
import {mapState} from "pinia";
import {useKeycloakStore} from "@/stores/keycloak";

export default {
  name: "NavTopBar",
  components: {ClockSolid},
  computed: {
    ...mapState(useKeycloakStore, ["authenticated", "userdata", "keycloak"])
  }
}
</script>

<style scoped>
#navbar {
  position: sticky;
  top: 0;
  left: 0;
  width: 100vw;
}
</style>
