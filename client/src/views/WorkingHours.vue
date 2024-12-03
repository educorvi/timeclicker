<template>
    <div class="text-center" style="width: 100%">
        <h1 class="w-100 mb-2 mt-2">
            {{ t('working_hour', 2) }}
        </h1>
        <div id="balances-div" class="text-start">
            <b-table-simple borderless>
                <b-tbody>
                    <b-tr>
                        <b-td>{{ t('time_balance') }}</b-td>
                        <b-td class="text-center">
                        <span v-if="timeBalanceData" :class="timeBalanceData.saldo<0?'text-danger':'text-success'">
                            <span v-if="timeBalanceData.saldo<0">
                                -
                            </span>
                            {{ humanizeDuration(timeBalanceData.saldo*60*60*1000, {units: ['h', 'm'], round: true, ...humanizeDurationShortLangConfig}) }}
                        </span>
                        </b-td>
                    </b-tr>
                    <b-tr>
                        <b-td>{{ t('vacation_days_left') }}</b-td>
                        <b-td class="text-center">
                        <span v-if="timeBalanceData"
                              :class="timeBalanceData.vacationDaysLeft<=0?'text-danger':'text-success'">
                            {{ timeBalanceData.vacationDaysLeft }}
                        </span>
                        </b-td>
                    </b-tr>
                </b-tbody>
            </b-table-simple>
        </div>
        <h2 class="mb-1">{{ t('manage_entries_for') }}</h2>
        <div class="w-100 d-flex justify-content-center">
            <b-input-group style="max-width: 300px">
                <b-form-select
                    :options="monthOptions"
                    v-model="month"
                ></b-form-select>
                <b-form-select :options="years" v-model="year"></b-form-select>
            </b-input-group>
        </div>
    </div>

    <div class="w-100 text-center mt-3 mb-3">
        <b-button variant="primary" @click="modalVisible = true">
            {{ t('new_entry') }}
        </b-button>
    </div>
    <div class="d-flex justify-content-center">
        <div id="hours-container" class="w-100" v-if="hours">
            <b-card v-if="hours.length === 0" class="text-center">
                {{ t('no_entries') }}
            </b-card>
            <div v-else>
                <b-card
                    v-for="hour in hours"
                    class="mb-3"
                    no-body
                    :border-variant="hour.vacation ? 'success' : undefined"
                >
                    <div class="d-flex">
                        <b-card-body>
                            <h4>
                                {{ d(hour.date, 'short') }}
                            </h4>
                            <p class="mb-0">
                                <span v-if="!hour.vacation">
                                    <strong>{{ t('duration') }}:</strong>
                                    {{
                                        humanizeDuration(
                                            hour.duration * 60 * 1000,
                                        )
                                    }}
                                </span>

                                <span v-else class="text-success">
                                    <strong>{{ t('vacation_day') }}</strong>
                                </span>
                            </p>
                        </b-card-body>
                        <b-button
                            class="hours-delete-button"
                            variant="danger"
                            @click="() => onDelete(hour.id)"
                        >
                            <IBiTrash3 />
                        </b-button>
                    </div>
                </b-card>
            </div>
        </div>
        <custom-spinner v-else />
    </div>

    <HoursEntryModal v-model:visible="modalVisible" @on-submit="() =>{fetchHours(); fetchTimeBalance()}" :vacationAvailable="vacationAvailable"/>
    <b-modal
        @ok="deleteHours"
        ref="deleteHoursModal"
        :title="t('delete_entry')"
        :ok-title="t('delete')"
        ok-variant="danger"
        :cancel-title="t('cancel')"
        centered
    >{{ t('delete_prompt') }}
    </b-modal>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { getMonthOptions, years } from '@/commons/DateUtils';
import { computed, onMounted, ref, watch } from 'vue';
import type { TimeBalanceData, WorkingHours } from 'timeclicker_server';
import axios from 'axios';
import humanizeDuration from 'humanize-duration';
import type { BModal } from 'bootstrap-vue-next';
import { UiError, useErrorStore } from '@/stores/error';
import { humanizeDurationShortLangConfig } from 'timeclicker_client/src/i18n';

const { t, d, locale } = useI18n();
const errorStore = useErrorStore();

const monthOptions = getMonthOptions(t);

const month = ref(new Date().getMonth() + 1);
const year = ref(new Date().getFullYear());

const modalVisible = ref(false);

const hours = ref<WorkingHours[] | null>(null);
const timeBalanceData = ref<TimeBalanceData | null>(null);

const deleteHoursModal = ref<InstanceType<typeof BModal> | null>(null);
const deleteHoursId = ref<string | null>(null);

const vacationAvailable = computed(() => {
    if(!timeBalanceData.value) return false;
    return timeBalanceData.value?.vacationDaysLeft > 0;
});

function fetchHours() {
    hours.value = null;
    const fromDate = new Date(year.value, month.value - 1, 1);
    const toDate = new Date(year.value, month.value, 0);
    axios
        .get(import.meta.env.VITE_API_ENDPOINT + 'hours', {
            params: {
                from: fromDate.toISOString(),
                to: toDate.toISOString(),
            },
        })
        .then((response) => {
            hours.value = response.data;
        })
        .catch((error) => {
             errorStore.setError(new UiError(t('errors.hours_failed'), error));
            hours.value = [];
        });
}

function fetchTimeBalance() {
    timeBalanceData.value = null;
    axios
        .get(import.meta.env.VITE_API_ENDPOINT + 'hours/balance')
        .then((response) => {
            timeBalanceData.value = response.data;
        }).catch((error) => {
             errorStore.setError(new UiError(t('errors.time_balance_failed'), error));
        });
}

function onDelete(id: string) {
    deleteHoursId.value = id;
    deleteHoursModal.value?.show();
}

async function deleteHours() {
    console.log(deleteHoursId.value);
    axios
        .delete(
            import.meta.env.VITE_API_ENDPOINT +
            'hours' +
            '/' +
            deleteHoursId.value,
        )
        .then(() => {
            deleteHoursId.value = null;
            fetchHours();
            fetchTimeBalance();
        }).catch((error) => {
             errorStore.setError(new UiError(t('errors.deletion_failed'), error));
        });
}

onMounted(fetchHours);
onMounted(fetchTimeBalance);

watch([month, year], () => {
    fetchHours();
    fetchTimeBalance();
});
</script>

<style scoped lang="scss">
#hours-container {
    max-width: 500px;
}

#balances-div {
    * {
        width: fit-content;
    }

    display: flex;
    justify-content: center;

    p {
        margin: 0;
    }

    margin-top: 20px;
}

.hours-delete-button {
    border-radius: var(--bs-card-border-radius);
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
}
</style>
