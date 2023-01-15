<template>
  <b-navbar id="navbar" variant="light">
    <b-navbar-brand>
      <clock-solid style="width: 35px"/> TimeClicker
    </b-navbar-brand>
    <!--      <h6 style="color: black">v{{version}}</h6>-->
    <b-navbar-nav class="ml-auto">
      <b-nav-item-dropdown right v-if="userdata">
        <template #button-content>
          <b-avatar :src="'data:image/png;base64, '+profilePicture" size="1.8rem"/> {{ userdata.firstName}} {{userdata.lastName }}
        </template>
        <b-dropdown-item :href="keycloak?.createLogoutUrl()">Logout</b-dropdown-item>
      </b-nav-item-dropdown>
    </b-navbar-nav>
  </b-navbar>
</template>

<script>
import ClockSolid from "@/components/icons/clock-solid.vue";
import {mapState} from "pinia";
import {useKeycloakStore} from "@/stores/keycloak";
import {BNavbar, BNavbarBrand, BNavbarNav, BNavItemDropdown, BAvatar, BDropdownItem} from "bootstrap-vue";

export default {
  name: "NavTopBar",
  components: {ClockSolid, BNavbar, BNavbarBrand, BNavbarNav, BNavItemDropdown, BAvatar, BDropdownItem},
  computed: {
    ...mapState(useKeycloakStore, ["authenticated", "userdata", "keycloak"]),
    profilePicture() {
      //@ts-ignore
      return this.userdata['attributes']['profilePicture'][0];
    },
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
