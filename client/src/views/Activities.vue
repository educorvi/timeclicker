<template>
    <overview ref="overview" :tasks="tasks">
        <div
            style="display: flex; width: 100%; justify-content: center"
            class="mb-4"
        >
            <b-button
                @click="showModal"
                variant="primary"
                style="max-width: 400px"
                class="w-100"
            >
                {{ t('new_entry') }}
            </b-button>
        </div>
    </overview>

    <entry-editor ref="entryModal" @on-submit="refresh" :tasks="tasks" />
</template>

<script lang="ts" setup>
import axios from 'axios';
import type { Task } from 'timeclicker_server';
import Overview from '@/components/Overview.vue';
import EntryEditor from '@/components/ActivityEntryEditor.vue';
import { type Ref, nextTick, onMounted, ref } from 'vue';
import { UiError, useErrorStore } from '@/stores/error';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';

const { t } = useI18n();

const errorStore = useErrorStore();

const tasks: Ref<Array<Task>> = ref([]);

const entryModal = ref<InstanceType<typeof EntryEditor> | null>(null);
const overview = ref<InstanceType<typeof Overview> | null>(null);

function refresh() {
    overview.value?.loadActivities();
}

function showModal() {
    entryModal.value?.setVisibility(true);
}

const route = useRoute();
const router = useRouter();

onMounted(async () => {
    try {
        const res = await axios.get(
            import.meta.env.VITE_API_ENDPOINT + 'tasks?open=true'
        );
        tasks.value = <Array<Task>>res.data;
    } catch (error) {
        tasks.value = [];
        errorStore.setError(new UiError(t('errors.tasks_failed'), error));
    }
    await nextTick();
    const { action = '', taskID = '' } = route.query;
    if (action === 'createTask' && taskID && !Array.isArray(taskID)) {
        entryModal.value?.setTask(taskID);
        showModal();
    }
    router.replace('/activities');
});
</script>
