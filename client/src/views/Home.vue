<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

const { t } = useI18n();

const router = useRouter();
</script>

<template>
    <div class="w-100 text-center mt-3">
        <h1>Dashboard</h1>
    </div>
    <b-container fluid>
        <b-row>
            <b-col cols="12" md="6">
                <div style="display: flex; justify-content: center">
                    <b-card
                        class="home-cards clickable"
                        @click="router.push('/activities')"
                    >
                        <h2>{{ t('manage_activities') }}</h2>
                    </b-card>
                </div>
            </b-col>

            <b-col cols="12" md="6">
                <div style="display: flex; justify-content: center">
                    <b-card
                        class="home-cards clickable"
                        @click="router.push('/hours')"
                    >
                        <h2>{{ t('manage_working_hours') }}</h2>
                    </b-card>
                </div>
            </b-col>
        </b-row>
    </b-container>
</template>

<style scoped lang="scss">
@import 'bootstrap/scss/functions';
@import 'bootstrap/scss/variables';
@import 'bootstrap/scss/mixins';
.home-cards {
    width: 100%;
    margin-top: 10px;
    margin-bottom: 10px;

    text-align: center;

    & h2 {
        margin: 0;
    }

    @include media-breakpoint-up(md) {
        width: 90%;
        padding-top: 20%;
        padding-bottom: 20%;
    }

    transition: all 0.3s;

    &:hover {
        box-shadow: 0 1rem 2rem 1px rgba(0, 0, 0, 0.175) !important;
        transform: scale(1.05);
        z-index: 1000;
    }

    h1 {
        margin: 0;
        text-align: center;
    }
}
</style>
