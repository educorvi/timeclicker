<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
</script>

<template>
    <b-tabs content-class="mt-3">
        <b-tab :title="t('activity', 2)">
            <orga-activities />
        </b-tab>
        <b-tab :title="t('working_hour', 2)"></b-tab>
        <b-tab :title="t('contract_data', 2)">
            <orga-contract-data />
        </b-tab>
    </b-tabs>
</template>

<style scoped></style>
