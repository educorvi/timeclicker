<script setup lang="ts">
import type { Activity } from 'timeclicker_server';
import type { TableFieldRaw } from 'bootstrap-vue-next';
import { useI18n } from 'vue-i18n';
import { getDurationOrDash, getHumanizedDuration } from '@/Commons.ts';
import {BRow, BCol, BCard, BCardBody, BCardFooter, BButtonGroup, BButton} from 'bootstrap-vue-next';

defineProps<{
    activities: Activity[]
    askToDeleteActivity: (activity: Activity) => void
    editActivity: (activity: Activity) => void
}>();

const { t, d, locale } = useI18n();


</script>

<template>
    <b-row align-v="stretch" id="row" align-h="start">
        <b-card class="activity-card text-center" v-if="!activities.length">
            {{ t('no_entries') }}
        </b-card>
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
                                    activity.breakMins * 60 * 1000
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

}

</style>