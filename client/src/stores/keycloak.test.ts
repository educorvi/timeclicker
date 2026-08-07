import axios from 'axios';
import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { authState, useKeycloakStore } from './keycloak';
import { useErrorStore } from './error';

function createKeycloak() {
    return {
        token: 'initial-token',
        loadUserProfile: vi.fn().mockResolvedValue({
            firstName: 'Test',
            lastName: 'User',
        }),
        updateToken: vi.fn().mockResolvedValue(false),
    };
}

describe('Keycloak store', () => {
    beforeEach(() => {
        setActivePinia(createPinia());
        delete axios.defaults.headers.common.Authorization;
    });

    it('loads the user profile and configures authenticated requests', async () => {
        vi.useFakeTimers();
        const store = useKeycloakStore();
        const keycloak = createKeycloak();
        store.setKeycloak(keycloak as never);

        store.setAuthenticated(authState.authenticated);
        await Promise.resolve();

        expect(store.userdata).toEqual({
            firstName: 'Test',
            lastName: 'User',
        });
        expect(axios.defaults.headers.common.Authorization).toBe(
            'initial-token'
        );
        expect(store.interval).toBeDefined();
    });

    it('updates the authorization header after refreshing a token', async () => {
        vi.useFakeTimers();
        const store = useKeycloakStore();
        const keycloak = createKeycloak();
        keycloak.updateToken.mockImplementation(async () => {
            keycloak.token = 'refreshed-token';
            return true;
        });
        store.setKeycloak(keycloak as never);

        store.setAuthenticated(authState.authenticated);
        await vi.advanceTimersByTimeAsync(6_000);

        expect(keycloak.updateToken).toHaveBeenCalledWith(70);
        expect(axios.defaults.headers.common.Authorization).toBe(
            'refreshed-token'
        );
    });

    it('clears the refresh interval when authentication ends', () => {
        vi.useFakeTimers();
        const store = useKeycloakStore();
        store.setKeycloak(createKeycloak() as never);
        store.setAuthenticated(authState.authenticated);

        store.setAuthenticated(authState.unauthenticated);

        expect(store.interval).toBeUndefined();
        expect(vi.getTimerCount()).toBe(0);
    });

    it('returns to the login state when token refresh fails', async () => {
        vi.useFakeTimers();
        const consoleError = vi
            .spyOn(console, 'error')
            .mockImplementation(() => undefined);
        const consoleLog = vi
            .spyOn(console, 'log')
            .mockImplementation(() => undefined);
        const store = useKeycloakStore();
        const keycloak = createKeycloak();
        keycloak.updateToken.mockRejectedValue(new Error('refresh failed'));
        store.setKeycloak(keycloak as never);

        store.setAuthenticated(authState.authenticated);
        await vi.advanceTimersByTimeAsync(6_000);

        expect(store.authenticated).toBe(authState.unauthenticated);
        expect(store.interval).toBeUndefined();
        expect(useErrorStore().errors).toHaveLength(1);
        expect(consoleError).toHaveBeenCalledWith('Failed to refresh token');
        expect(consoleLog).toHaveBeenCalledWith('No toast service available');
    });
});
