<template>
    <b-navbar id="navbar" variant="primary" class="navbar-dark" toggleable="lg">
        <b-navbar-brand id="nav-logo" to="/">
            <clock-solid style="width: 35px" />
            <span style="vertical-align: middle"> TimeClicker </span>
        </b-navbar-brand>
        <BNavbarToggle target="nav-collapse" />
        <BCollapse id="nav-collapse" is-nav right>
            <BNavbarNav>
                <li class="nav-item">
                    <RouterLink class="nav-link" to="/"
                        >{{ t('activity', 2) }}
                    </RouterLink>
                </li>
                <li class="nav-item">
                    <RouterLink class="nav-link" to="/statistics"
                        >{{ t('statistic', 2) }}
                    </RouterLink>
                </li>
                <li class="nav-item" v-if="userdata && keycloak && keycloak.hasRealmRole('orga')">
                    <RouterLink class="nav-link" to="/orga">{{
                        t('orga_ui')
                    }}</RouterLink>
                </li>
            </BNavbarNav>
            <BNavbarNav class="ms-auto mb-2 mb-lg-0">
                <b-nav-item-dropdown right v-if="userdata && keycloak">
                    <template #button-content>
                        <b-avatar
                            :src="profilePicture"
                            size="1.8rem"
                            rounded
                        />
                        <span style="vertical-align: middle; margin-left: 5px">
                            {{ userdata.firstName }} {{ userdata.lastName }}
                        </span>
                    </template>
                    <b-dropdown-item to="/settings"
                        >{{ t('settings') }}
                    </b-dropdown-item>
                    <b-dropdown-item to="/about"
                        >{{ t('about') }}
                    </b-dropdown-item>
                    <b-dropdown-item :href="keycloak?.createLogoutUrl()"
                        >{{ t('logout') }}
                    </b-dropdown-item>
                </b-nav-item-dropdown>
            </BNavbarNav>
        </BCollapse>
        <!--      <h6 style="color: black">v{{version}}</h6>-->
    </b-navbar>
</template>

<script setup>
import ClockSolid from '@/components/icons/clock-solid.vue';
import { storeToRefs } from 'pinia';
import { useKeycloakStore } from '@/stores/keycloak';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const { keycloak, userdata, authenticated } = storeToRefs(useKeycloakStore());

const profilePicture = computed(() => {
    if (userdata.value?.attributes?.profilePicture) {
        return 'data:image/png;base64, ' + userdata.value?.attributes?.profilePicture?.[0];
    } else {
        return undefined;
    }

});
</script>

<style lang="scss">
#navbar {
    position: sticky;
    top: 0;
    left: 0;
    width: 100vw;
    z-index: 1000;
}

#navbar .dropdown-toggle::after {
    vertical-align: middle;
}

#nav-logo {
    :hover {
        border: none;
    }

    border: none;
}
</style>
