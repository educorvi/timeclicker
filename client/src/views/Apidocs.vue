<template>
    <div id="swaggerUIDiv">{{ t('load_swaggerui') }}</div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue';
import 'swagger-ui-dist/swagger-ui.css';
import { useI18n } from 'vue-i18n';
import type { SwaggerUIOptions } from 'swagger-ui';
import type SwaggerUI from 'swagger-ui';
import { useKeycloakStore } from '@/stores/keycloak';

const { t } = useI18n();

const kcStore = useKeycloakStore();

const ls = window.localStorage;

// console.log(kcStore.keycloak?.);

const auth = {
    educorvi_sso: {
        schema: {
            flow: 'implicit',
            authorizationUrl:
                'https://sso.educorvi.de/realms/educorvi/protocol/openid-connect/auth',
            scopes: {
                openid: 'default scope',
                profile: 'profile scope',
                email: 'email scope',
            },
            type: 'oauth2',
        },
        clientId: 'timeclicker',
        name: 'educorvi_sso',
        passwordType: 'basic',
        username: '',
        token: {
            state: btoa(new Date().toString()),
            access_token: undefined as string | undefined,
            token_type: 'Bearer',
            expires_in: '900',
        },
        clientSecret: '',
        password: '',
        scopes: ['openid', 'profile', 'email'],
    },
};

onMounted(async () => {
    auth.educorvi_sso.token.access_token = kcStore.keycloak?.token;
    ls.setItem('authorized', JSON.stringify(auth));
    const SwaggerUI = (await import('swagger-ui-dist')).SwaggerUIBundle;
    const node = document.getElementById('swaggerUIDiv');

    const ui = SwaggerUI({
        domNode: node,
        url: import.meta.env.VITE_API_ENDPOINT + 'swagger.json',
        oauth2RedirectUrl: window.location.toString(),
        persistAuthorization: true,
    });
    ui.initOAuth({
        clientId: 'timeclicker',
        scopes: ['openid', 'profile', 'email'],
    });
});
onBeforeUnmount(() => {
    ls.removeItem('authorized');
});
</script>

<style lang="scss">
#swaggerUIDiv {
    /*background-color: white;*/
    /*padding: 5px;*/
    margin: -10px;
}

.swagger-ui {
    @media (prefers-color-scheme: dark) {
        filter: invert(88%) hue-rotate(180deg);
    }

    padding-top: 5px;
    padding-bottom: 5px;
    max-width: 100%;
    overflow-x: hidden;
}

.swagger-ui .highlight-code {
    filter: invert(100%) hue-rotate(180deg);
}

.modal-ux {
    top: 50vh !important;
}

.backdrop-ux {
    background: rgba(0, 0, 0, 0.2) !important;
}

.auth-wrapper,
.authorization__btn {
    display: none !important;
}

.scheme-container {
    display: none !important;
}
</style>
