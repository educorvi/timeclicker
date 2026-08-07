<script setup lang="ts">
import type { Activity } from 'timeclicker_server';
import type { TableFieldRaw } from 'bootstrap-vue-next';
import { useI18n } from 'vue-i18n';
import { getDurationOrDash, getHumanizedDuration } from '@/Commons.ts';

defineProps<{
    activities: Activity[]
    askToDeleteActivity: (activity: Activity) => void
    editActivity: (activity: Activity) => void
}>();

const { t, d, locale } = useI18n();

const tableFields: TableFieldRaw<Activity>[] = [
    'date',
    {
        key: 'from',
        sortable: true,
        initialSortDirection: 'asc'
    },
    {
        key: 'to',
        sortable: true,
    },
    'duration',
    'break',
    'task',
    'edit',
];
</script>

<template>
    <b-card class="activity-card text-center" v-if="!activities.length">
        {{ t('no_entries') }}
    </b-card>
    <BTable
        v-else
        class="activities-table"
        align="middle"
        hover
        :items="activities"
        :fields="tableFields"
        responsive="sm">
        <template #cell(task)="data">
            {{ data.item.task.title }}
        </template>
        <template #cell(date)="data">
            {{ data.item.from ? d(data.item.from, 'short') : '' }}
        </template>
        <template #cell(from)="data">
            {{ data.item.from ? d(data.item.from, 'time') : '' }}
        </template>
        <template #cell(to)="data">
            {{ data.item.to ? d(data.item.to, 'time') : '' }}
        </template>
        <template #cell(duration)="data">
            {{ getDurationOrDash(data.item.from, data.item.to) }}
        </template>
        <template #cell(break)="data">
            {{ getHumanizedDuration(data.item.breakMins * 60 * 1000) || '0 min'}}
        </template>
        <template #cell(edit)="data">
            <b-button-group class="w-100">
                <b-button
                    class="w-50"
                    variant="outline-secondary"
                    @click="editActivity(data.item)"
                >
                    <IBiPencil :aria-label="t('edit')" />
                </b-button>
                <b-button
                    class="w-50"
                    variant="outline-danger"
                    @click="askToDeleteActivity(data.item)"
                >
                    <IBiTrash3 :aria-label="t('delete')" />
                </b-button>
            </b-button-group>
        </template>
    </BTable>
</template>

<style lang="scss">
.activities-table td {
    button {
        height: 100%;
        padding: 0.5rem;
        border-radius: 0.2rem;

        svg {
            width: 1.1rem;
            height: 1.1rem;
            display: block;
        }
    }
}

</style>