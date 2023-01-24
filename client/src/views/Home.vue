<template>
  <div style="display: flex; width: 100%; justify-content: center" class="mb-4">
    <b-button @click="showModal" variant="primary" style="max-width: 400px" class="w-100">Neuer Eintrag
    </b-button>
  </div>

  <overview ref="overview" :tasks="tasks"/>

  <entry-editor ref="entryModal" :done="refresh" :tasks="tasks"/>
</template>

<script lang="ts" setup>
import {BButton} from "bootstrap-vue";
import axios from "axios";
import type {Task} from "timeclicker_server";
import Overview from "@/components/Overview.vue";
import EntryEditor from "@/views/EntryEditor.vue";
import type {Ref} from "vue";
import {onMounted, ref} from "vue";

const tasks: Ref<Array<Task>> = ref([]);

onMounted(() => {
  axios.get(import.meta.env.VITE_API_ENDPOINT + "tasks").then(res => {
    tasks.value = <Array<Task>>res.data;
  })
});


const entryModal = ref<InstanceType<typeof EntryEditor>|null>(null);
const overview = ref<InstanceType<typeof Overview>|null>(null);

function showModal() {
  entryModal.value?.setVisibility(true)
}

function refresh() {
  overview.value?.loadActivities();
}
</script>

