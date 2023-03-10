import {defineStore} from "pinia";
import type Keycloak from "keycloak-js";
import type {KeycloakProfile} from "keycloak-js";
import axios from "axios";

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
                    });
                }, 6000)
            }
        },
    },
})
