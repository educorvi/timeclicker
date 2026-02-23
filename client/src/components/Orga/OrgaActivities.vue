<template>
    <div v-if="tasks && users">
        <b-card id="filterContainer" :header="t('filter', 2)">
            <b-input-group :prepend="t('from')">
                <b-form-input
                    v-model="from"
                    class="dateInput"
                    type="date"
                ></b-form-input>
            </b-input-group>
            <b-input-group :prepend="t('to')">
                <b-form-input
                    v-model="to"
                    class="dateInput"
                    type="date"
                ></b-form-input>
            </b-input-group>
            <hr />
            <tag-dropdown
                v-model="selectedTasks"
                @change="loadActivities"
                :label="t('task', 2)"
                :options="
                    tasks.map((u) => {
                        return { desc: u.title, id: u.id };
                    })
                "
            ></tag-dropdown>
            <hr />
            <tag-dropdown
                v-model="selectedUsers"
                @change="loadActivities"
                :options="
                    users.map((u) => {
                        return { desc: u.name, id: u.id };
                    })
                "
                :label="t('user', 2)"
            ></tag-dropdown>
        </b-card>

        <b-button
            class="w-100 mt-4 mb-4"
            variant="primary"
            @click="downloadJSON"
            >{{ t('download') }}</b-button
        >

        <b>{{ t('total_time') }}: {{ hours }}</b>
        <b-table
            :tbody-transition-props="{ name: 'flip-list' }"
            striped
            responsive="sm"
            :items="tableActivities"
            :fields="fields"
            primary-key="id"
        >
            <template #cell(from)="row">
                {{
                    row.item.from
                        ? new Date(row.item.from).toLocaleString()
                        : '-'
                }}
            </template>
            <template #cell(to)="row">
                {{ row.item.to ? new Date(row.item.to).toLocaleString() : '-' }}
            </template>
            <template #cell(duration)="row">
                {{
                    humanizeDuration(
                        (row.item.to || 0) - (row.item.from || 0),
                        { language: i18Lang, units: ['h', 'm'] }
                    )
                }}
            </template>
            <template #cell(show_details)="row">
                <b-button size="sm" @click="row.toggleExpansion" class="mr-2">
                    {{ row.expansionShowing ? t('hide_note') : t('show_note') }}
                </b-button>
            </template>
            <template #row-expansion="row">
                <b-card :header="t('note')">
                    {{ row.item.note }}
                </b-card>
            </template>
        </b-table>
    </div>
    <custom-spinner v-else />
</template>

<script setup lang="ts">
import { computed, type ComputedRef, onMounted, ref, watch } from 'vue';
import type { Ref } from 'vue';
import type { Task, User, Activity } from 'timeclicker_server';
import axios from 'axios';
import TagDropdown from '@/components/tagDropdown.vue';
import CustomSpinner from '@/App.vue';
import humanizeDuration from 'humanize-duration';
import { saveAs } from 'file-saver';
import { UiError, useErrorStore } from '@/stores/error';
import { useI18n } from 'vue-i18n';
import type { TagOption } from '@/additionalTypes';

const errorStore = useErrorStore();

const tasks: Ref<Array<Task>> = ref([]);
const users: Ref<Array<User>> = ref([]);

const selectedTasks: Ref<TagOption[]> = ref([]);
const selectedUsers: Ref<TagOption[]> = ref([]);

const activities: Ref<Activity[]> = ref([]);

const firstOfMonth = new Date();
firstOfMonth.setDate(1);
const lastOfMonth = new Date();
lastOfMonth.setMonth(lastOfMonth.getMonth() + 1, 0);

const from = ref(firstOfMonth.toISOString().split('T')[0]);
const to = ref(lastOfMonth.toISOString().split('T')[0]);

const { t, locale } = useI18n();

const i18Lang = ref(locale.value);

onMounted(() => {
    axios
        .get(import.meta.env.VITE_API_ENDPOINT + 'tasks')
        .then((res) => {
            tasks.value = <Array<Task>>res.data;
        })
        .catch((error) => {
            errorStore.setError(new UiError(t('errors.tasks_failed'), error));
        });

    axios
        .get(import.meta.env.VITE_API_ENDPOINT + 'orga/users')
        .then((res) => {
            users.value = <Array<User>>res.data;
        })
        .catch((error) => {
            errorStore.setError(new UiError(t('errors.users_failed'), error));
        });
    loadActivities();
});

function loadActivities() {
    const startDate = new Date(from.value);
    const endDate = new Date(to.value);
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);
    axios
        .get(import.meta.env.VITE_API_ENDPOINT + 'orga/activities', {
            params: {
                users: selectedUsers.value.map((u) => u.id),
                tasks: selectedTasks.value.map((t) => t.id),
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
        })
        .catch((error) => {
            errorStore.setError(new UiError(t('errors.act_failed'), error));
        });
}

const hours = computed(() => {
    return humanizeDuration(
        activities.value.reduce((prev: number, curr: Activity) => {
            return (
                prev + ((curr.to?.getTime() || 0) - (curr.from?.getTime() || 0))
            );
        }, 0),
        { language: locale.value, units: ['h', 'm'] }
    );
});

type TableActivity = Omit<Activity, 'to' | 'from'> & {
    to: number | undefined,
    from: number | undefined
}

const tableActivities: ComputedRef<TableActivity[]> = computed(() =>
    activities.value.map((a) => {
        return {
            ...a,
            to: a.to?.getTime(),
            from: a.from?.getTime(),
        };
    })
);

const fields = ref([
    {
        key: 'user',
        label: t('user'),
        sortable: true,
        accessor: (item: TableActivity) => item.user.name,
    },
    {
        key: 'task',
        label: t('task'),
        sortable: true,
        accessor: (item: TableActivity) => item.task.title,
    },
    {
        key: 'duration',
        label: t('duration'),
        sortable: true,
    },
    {
        key: 'from',
        label: t('from'),
        sortable: true,
    },
    {
        key: 'to',
        label: t('to'),
        sortable: true,
    },
    {
        label: t('note'),
        key: 'show_details',
        sortable: false,
    },
]);

function downloadJSON() {
    const toSave = new Blob([JSON.stringify(activities.value)], {
        type: 'application/json',
    });
    saveAs(toSave, 'timeclicker.json');
}

watch(from, loadActivities);
watch(to, loadActivities);
</script>

<style>
#filterContainer > .card-body > * {
    margin-top: 5px;
}

table .flip-list-move {
    transition: transform 1s;
}

table .flip-list-enter-active,
table .flip-list-leave-active {
    transition: opacity 0.5s ease;
}

table .flip-list-enter-from,
table .flip-list-leave-to {
    opacity: 0;
}
</style>
