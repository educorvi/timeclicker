import { defineStore } from 'pinia';
import type Keycloak from 'keycloak-js';
import type { KeycloakProfile } from 'keycloak-js';
import axios from 'axios';
import { UiError, useErrorStore } from '@/stores/error';
import i18n from '@/i18n';

export enum authState {
    'checking',
    'authenticated',
    'unauthenticated',
}

export const useKeycloakStore = defineStore('keycloak', {
    state: () => {
        return {
            authenticated: authState.checking,
            interval: undefined as any,
            keycloak: undefined as Keycloak | undefined,
            userdata: undefined as KeycloakProfile | undefined,
        };
    },
    actions: {
        setKeycloak(keycloak: Keycloak) {
            this.keycloak = keycloak;
        },
        setAuthenticated(currAuthState: authState) {
            this.authenticated = currAuthState;
            if (
                this.authenticated === authState.authenticated &&
                this.keycloak
            ) {
                this.keycloak.loadUserProfile().then((res) => {
                    this.userdata = res;
                });
                const keycloak = this.keycloak;
                axios.defaults.headers.common[
                    'Authorization'
                ] = `${keycloak.token}`;
                this.interval = setInterval(() => {
                    keycloak
                        .updateToken(70)
                        .then((refreshed) => {
                            if (refreshed) {
                                console.debug('Token refreshed');
                                axios.defaults.headers.common[
                                    'Authorization'
                                ] = `${keycloak.token}`;
                            }
                        })
                        .catch(() => {
                            console.error('Failed to refresh token');
                            useErrorStore().setError(
                                new UiError(
                                    i18n.global.t('errors.token_refresh')
                                )
                            );
                            this.setAuthenticated(authState.unauthenticated);
                        });
                }, 6000);
            } else if (this.interval !== undefined) {
                // clear refresh interval when unauthenticated to avoid toast spam
                clearInterval(this.interval);
                this.interval = undefined;
            }
        },
    },
});
