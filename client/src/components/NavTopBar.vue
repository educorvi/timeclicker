<template>
    <b-navbar id="navbar" variant="primary" class="navbar-dark">
        <b-navbar-brand to="/">
            <clock-solid style="width: 35px" />
            TimeClicker
        </b-navbar-brand>
        <!--      <h6 style="color: black">v{{version}}</h6>-->
        <b-navbar-nav class="ml-auto">
            <b-nav-item-dropdown right v-if="userdata && keycloak">
                <template #button-content>
                    <b-avatar
                        :src="'data:image/png;base64, ' + profilePicture"
                        size="1.8rem"
                    />
                    {{ userdata.firstName }} {{ userdata.lastName }}
                </template>
                <b-dropdown-item
                    v-if="keycloak.hasRealmRole('orga')"
                    to="/orga"
                    >{{ t('orga_ui') }}</b-dropdown-item
                >
                <b-dropdown-item to="/settings">{{
                    t('settings')
                }}</b-dropdown-item>
                <b-dropdown-item to="/about">{{ t('about') }}</b-dropdown-item>
                <b-dropdown-item :href="keycloak?.createLogoutUrl()">{{
                    t('logout')
                }}</b-dropdown-item>
            </b-nav-item-dropdown>
        </b-navbar-nav>
    </b-navbar>
</template>

<script setup>
import ClockSolid from '@/components/icons/clock-solid.vue';
import { storeToRefs } from 'pinia';
import { useKeycloakStore } from '@/stores/keycloak';
import {
    BNavbar,
    BNavbarBrand,
    BNavbarNav,
    BNavItemDropdown,
    BAvatar,
    BDropdownItem,
} from 'bootstrap-vue';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const { keycloak, userdata, authenticated } = storeToRefs(useKeycloakStore());

const profilePicture = computed(() => {
    return userdata.value['attributes']['profilePicture'][0];
});
</script>

<style scoped>
#navbar {
    position: sticky;
    top: 0;
    left: 0;
    width: 100vw;
    z-index: 1000;
}
</style>
