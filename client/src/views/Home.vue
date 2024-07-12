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
                    <b-card class="home-cards clickable" @click="router.push('/activities')">
                        <h1>{{ t('manage_activities') }}</h1>
                    </b-card>
                </div>
            </b-col>

            <b-col cols="12" md="6">
                <div style="display: flex; justify-content: center">
                    <b-card class="home-cards clickable" @click="router.push('/hours')">
                        <h1>{{ t('manage_working_hours') }}</h1>
                    </b-card>
                </div>
            </b-col>
        </b-row>
    </b-container>
</template>

<style scoped lang="scss">
.home-cards {
    width: 90%;
    margin-top: 20px;
    margin-bottom: 20px;

    padding-top: 20%;
    padding-bottom: 20%;

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