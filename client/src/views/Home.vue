<template>

  <overview ref="overview" :tasks="tasks">

    <div style="display: flex; width: 100%; justify-content: center" class="mb-4">
      <b-button @click="showModal" variant="secondary" style="max-width: 400px" class="w-100">
        {{t('new_entry')}}
      </b-button>
    </div>
  </overview>

  <entry-editor ref="entryModal" @on-submit="refresh" :tasks="tasks"/>
</template>

<script lang="ts" setup>
import {BButton} from "bootstrap-vue";
import axios from "axios";
import type {Task} from "timeclicker_server/src/libindex";
import Overview from "@/components/Overview.vue";
import EntryEditor from "@/components/EntryEditor.vue";
import type {Ref} from "vue";
import {onMounted, ref} from "vue";
import {UiError, useErrorStore} from "@/stores/error";
import {useI18n} from "vue-i18n";

const {t} = useI18n();

const errorStore = useErrorStore();

const tasks: Ref<Array<Task>> = ref([]);

onMounted(() => {
  axios.get(import.meta.env.VITE_API_ENDPOINT + "tasks").then(res => {
    tasks.value = <Array<Task>>res.data;
  }).catch(error => {
    tasks.value = [];
    errorStore.setError(new UiError(t('errors.tasks_failed'), error));
  })
});


const entryModal = ref<InstanceType<typeof EntryEditor> | null>(null);
const overview = ref<InstanceType<typeof Overview> | null>(null);

function showModal() {
  entryModal.value?.setVisibility(true)
}

function refresh() {
  console.log(!!overview.value)
  overview.value?.loadActivities();
}
</script>

