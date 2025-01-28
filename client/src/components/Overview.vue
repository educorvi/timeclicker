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
    <p class="w-100 text-center mt-2 mb-3">
        {{ t('total') }}: {{ hours }}
        <br />
        <span v-if="breaks" class="text-muted">
            (+{{ getHumanizedDuration(breaks) }} {{ t('break') }})
        </span>
    </p>

    <slot />

    <div v-if="loaded">
        <b-container fluid id="overview_container">
            <b-row align-v="stretch" id="row" align-h="start">
                <b-col v-if="loaded && activities.length === 0">
                    <b-card class="activity-card text-center">
                        {{ t('no_entries') }}
                    </b-card>
                </b-col>
                <b-col
                    v-for="activity in activities"
                    :key="activity.id"
                    class="mb-4"
                >
                    <b-card no-body class="activity-card">
                        <b-card-body>
                            <h5 class="mb-0">
                                {{
                                    activity.from
                                        ? d(activity.from, 'long')
                                        : ''
                                }}
                                -
                                {{ activity.to ? d(activity.to, 'time') : '' }}
                            </h5>
                            <p class="mb-2">
                                {{
                                    getDurationOrDash(
                                        activity.from,
                                        activity.to,
                                        activity.breakMins * 60 * 1000,
                                    )
                                }}
                                <span
                                    v-if="activity.breakMins"
                                    class="text-muted"
                                >
                                    (+{{
                                        getHumanizedDuration(
                                            activity.breakMins * 60 * 1000,
                                            ['m'],
                                        )
                                    }}
                                    {{ t('break') }})
                                </span>
                            </p>
                            <p class="mb-0 text-muted">
                                {{ activity.task.title }}
                            </p>
                        </b-card-body>
                        <b-card-footer>
                            <b-button-group class="mt-2 mb-2 w-100">
                                <b-button
                                    class="w-50"
                                    variant="outline-secondary"
                                    @click="editActivity(activity)"
                                >{{ t('edit') }}
                                </b-button>
                                <b-button
                                    class="w-50"
                                    variant="outline-danger"
                                    @click="askToDeleteActivity(activity)"
                                >{{ t('delete') }}
                                </b-button>
                            </b-button-group>
                        </b-card-footer>
                    </b-card>
                </b-col>
            </b-row>
        </b-container>

        <entry-editor
            v-if="editableActivity"
            ref="acEditor"
            :tasks="tasks"
            :id="editableActivity.id"
            :initial-data="editableActivity"
            @on-submit="onEditorSubmit"
            @on-close="onEditorClose"
        />
        <b-modal
            @ok="deleteActivity"
            ref="deleteModal"
            :title="t('delete_entry')"
            :ok-title="t('delete')"
            ok-variant="danger"
            :cancel-title="t('cancel')"
            centered
        >{{ t('delete_prompt') }}
        </b-modal>
    </div>
    <custom-spinner v-else />
</template>

<script lang="ts" setup>
import type { Activity, Task } from 'timeclicker_server';
import CustomSpinner from './CustomSpinner.vue';
import axios from 'axios';
import humanizeDuration from 'humanize-duration';
import EntryEditor from '@/components/ActivityEntryEditor.vue';
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import { UiError, useErrorStore } from '@/stores/error';
import { useI18n } from 'vue-i18n';
import { getMonthOptions, years } from '@/commons/DateUtils';
import type { BModal } from 'bootstrap-vue-next';

const props = defineProps<{ tasks: Array<Task> }>();

const { t, d, locale } = useI18n();

const errorStore = useErrorStore();

const editableActivity = ref<Activity | null>(null);
const acEditor = ref<InstanceType<typeof EntryEditor> | null>(null);
const deleteModal = ref<InstanceType<typeof BModal> | null>(null);

const loaded = ref(false);
const activities = ref<Array<Activity>>([]);

const monthOptions = getMonthOptions(t);

const month = ref(new Date().getMonth() + 1);
const year = ref(new Date().getFullYear());

const breaks = computed(() => {
    return activities.value.reduce((prev: number, curr: Activity) => {
        return prev + curr.breakMins * 60 * 1000;
    }, 0);
});

const hours = computed(() => {
    return getHumanizedDuration(
        activities.value.reduce((prev: number, curr: Activity) => {
            return (
                prev + ((curr.to?.getTime() || 0) - (curr.from?.getTime() || 0))
            );
        }, 0) - (breaks.value || 0),
    );
});

function getHumanizedDuration(
    duration: number,
    units: humanizeDuration.Unit[] = ['h', 'm'],
) {
    return humanizeDuration(duration, {
        language: locale.value,
        units: units,
    });
}

/**
 * Returns duration between `from` and `to` (minus `sub`, if specified)
 * @param from
 * @param to
 * @param sub
 */
function getDurationOrDash(from: Date | null, to: Date | null, sub = 0) {
    if (!from || !to) {
        return ' - ';
    }
    return getHumanizedDuration(to.getTime() - from.getTime() - sub);
}

function loadActivities() {
    loaded.value = false;
    const startDate = new Date(year.value, month.value - 1, 1);
    const endDate = new Date(year.value, month.value, 0, 23, 59, 59, 999);
    axios
        .get(import.meta.env.VITE_API_ENDPOINT + 'activities', {
            params: {
                from: startDate.toISOString(),
                to: endDate.toISOString(),
            },
        })
        .then((res) => {
            activities.value = <Array<Activity>>res.data.map((a: any) => {
                return {
                    ...a,
                    from: new Date(a.from),
                    to: new Date(a.to),
                };
            });
            loaded.value = true;
        })
        .catch((error) => {
            activities.value = [];
            loaded.value = true;
            errorStore.setError(new UiError(t('errors.act_failed'), error));
        });
}

function askToDeleteActivity(activity: Activity) {
    editableActivity.value = activity;
    deleteModal.value?.show();
}

function deleteActivity() {
    if (editableActivity.value) {
        axios
            .delete(
                import.meta.env.VITE_API_ENDPOINT +
                'activities/' +
                editableActivity.value.id,
            )
            .then(loadActivities)
            .catch((error) => {
                errorStore.setError(new UiError(t('errors.deletion_failed'), error));
            });
    }
}

async function editActivity(activity: Activity) {
    editableActivity.value = activity;
    await nextTick();
    acEditor.value?.setVisibility(true);
}

function onEditorClose() {
    editableActivity.value = null;
}

function onEditorSubmit() {
    loadActivities();
}

watch(year, loadActivities);
watch(month, loadActivities);

onMounted(() => {
    loadActivities();
});

defineExpose({
    loadActivities,
});
</script>

<style>
.activity-card {
    width: 23rem;
    max-width: 100%;
    height: 100%;
}

@media (max-width: 420px) {
    .activity-card {
        width: 100% !important;
        height: 100%;
    }

    #row, #row .col {
        padding: 0;
        width: 100% !important;
    }

    #row {
        display: block;
    }
}

#row {
    width: fit-content;
    max-width: 100%;
    margin: 0;
}

#overview_container {
    padding: 0;
    display: flex;
    justify-content: center;
}

#row .col {
    max-width: 100%;
    justify-content: center;
    display: flex;
}

.activity-card .card-footer {
    background-color: unset;
}
</style>
