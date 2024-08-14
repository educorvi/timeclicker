<template>
    <div class="text-center" style="width: 100%">
        <h1 class="w-100 mb-2 mt-2">
            {{ t('overview_for') }}
        </h1>
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
                                            hour.duration * 60 * 1000
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

    <HoursEntryModal v-model:visible="modalVisible" @on-submit="fetchHours" />
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
import { onMounted, ref, watch } from 'vue';
import type { WorkingHours } from 'timeclicker_server';
import axios from 'axios';
import humanizeDuration from 'humanize-duration';
import type { BModal } from 'bootstrap-vue-next';

const { t, d } = useI18n();

const monthOptions = getMonthOptions(t);

const month = ref(new Date().getMonth() + 1);
const year = ref(new Date().getFullYear());

const modalVisible = ref(false);

const hours = ref<WorkingHours[] | null>(null);

const deleteHoursModal = ref<InstanceType<typeof BModal> | null>(null);
const deleteHoursId = ref<string | null>(null);

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
                deleteHoursId.value
        )
        .then(() => {
            deleteHoursId.value = null;
            fetchHours();
        });
}

onMounted(fetchHours);

watch([month, year], fetchHours);
</script>

<style scoped lang="scss">
#hours-container {
    max-width: 500px;
}

.hours-delete-button {
    border-radius: var(--bs-card-border-radius);
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
}
</style>
