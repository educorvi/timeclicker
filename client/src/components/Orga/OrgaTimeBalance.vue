<template>
    <div v-if="tableData">
        <BTableSimple>
            <BThead>
                <BTr>
                    <BTh>{{ t('name') }}</BTh>
                    <BTh>{{ t('time_balance') }}</BTh>
                    <BTh>{{ t('vacation_days') }}</BTh>
                </BTr>
            </BThead>
            <BTbody>
                <BTr v-for="row in tableData">
                    <BTd>{{ row.name }}</BTd>
                    <BTd><span :class="row.timeBalance<0?'text-danger':'text-success'">{{ row.timeBalance }}</span></BTd>
                    <BTd>{{ row.vacationDays }}</BTd>
                </BTr>
            </BTbody>
        </BTableSimple>
    </div>
    <custom-spinner v-else />
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import axios from 'axios';
import type { User } from 'timeclicker_server';
import { UiError, useErrorStore } from '@/stores/error';
import { useI18n } from 'vue-i18n';
import type { WeekTimeBalanceData } from 'timeclicker_server';

const errorStore = useErrorStore();
const { t } = useI18n();

const users = ref<Array<User> | null>(null);
const timeBalances = ref<Record<string, WeekTimeBalanceData[]>>()

const tableData = computed(() => {
    if(!users.value || !timeBalances.value) return null;

    const tableRes = [];

    for (const [key, value] of Object.entries(timeBalances.value)) {
        const name = users.value.find(user => user.id === key)?.name;
        tableRes.push({
            name,
            timeBalance: value[value.length - 1].timeBalance,
            vacationDays: 0 //TODO
        });
    }
    return tableRes;
});

onMounted(() => {
    axios
        .get(import.meta.env.VITE_API_ENDPOINT + 'orga/users')
        .then((res) => {
            users.value = <Array<User>>res.data;
        })
        .catch((error) => {
            errorStore.setError(new UiError(t('errors.users_failed'), error));
        });
    axios
        .get(import.meta.env.VITE_API_ENDPOINT + 'orga/time-balance')
        .then((res) => {
            timeBalances.value = <Record<string, WeekTimeBalanceData[]>>res.data;
        })
        .catch((error) => {
            errorStore.setError(new UiError(t('errors.time_balance_failed'), error));
        });
});
</script>

<style scoped>

</style>