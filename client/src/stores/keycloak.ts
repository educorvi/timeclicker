import {defineStore} from "pinia";
import type Keycloak from "keycloak-js";
import type {KeycloakProfile} from "keycloak-js";
import axios from "axios";
import {UiError, useErrorStore} from "@/stores/error";
import {useI18n} from "vue-i18n"


const {t} = useI18n();
export enum authState {
    "checking",
    "authenticated",
    "unauthenticated"
}

export const useKeycloakStore = defineStore('keycloak', {
    state: () => {
        return {
            keycloak: undefined as Keycloak | undefined,
            authenticated: authState.checking,
            userdata: undefined as KeycloakProfile | undefined
        }
    },
    actions: {
        setKeycloak(keycloak: Keycloak) {
            this.keycloak = keycloak;
        },
        setAuthenticated(currAuthState: authState) {
            this.authenticated = currAuthState;
            if (this.authenticated === authState.authenticated && this.keycloak) {
                this.keycloak.loadUserProfile().then(res => {
                    this.userdata = res;
                });
                const keycloak = this.keycloak;
                axios.defaults.headers.common['Authorization'] = `${keycloak.token}`;
                setInterval(() => {
                    keycloak.updateToken(70).then((refreshed) => {
                        if (refreshed) {
                            console.log('Token refreshed');
                            axios.defaults.headers.common['Authorization'] = `${keycloak.token}`;
                        }
                    }).catch(() => {
                        console.error('Failed to refresh token');
                        useErrorStore().setError(new UiError(t("errors.token_refresh")));
                        this.setAuthenticated(authState.unauthenticated);
                    });
                }, 6000)
            }
        },
    },
})
