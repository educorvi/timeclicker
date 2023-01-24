<template>
  <div style="display: flex; width: 100%; justify-content: center" class="mb-4">
    <b-button @click="showModal" variant="primary" style="max-width: 400px" class="w-100">Neuer Eintrag
    </b-button>
  </div>

  <overview ref="overview" :tasks="tasks"/>

  <entry-editor ref="entryModal" :done="refresh" :tasks="tasks"/>
</template>

<script lang="ts">
import {BButton} from "bootstrap-vue";
import axios from "axios";
import type {Task} from "timeclicker_server";
import Overview from "@/components/Overview.vue";
import EntryEditor from "@/views/EntryEditor.vue";

export default {
  name: "Home",
  components: {EntryEditor, Overview, BButton},
  data() {
    return {
      tasks: [] as Array<Task>,
      modalVisible: false
    }
  },
  created() {
    axios.get(import.meta.env.VITE_API_ENDPOINT + "tasks").then(res => {
      this.tasks = <Array<Task>>res.data;
    }).catch(() => {
      this.$bvToast.toast('Aufgaben konnten nicht geladen werden. Probiere es später erneut.', {
        title: "Fehler",
        variant: "danger",
        autoHideDelay: 20000
      })
    });
  },
  methods: {
    showModal() {
      this.$refs.entryModal.setVisibility(true);
    },
    refresh() {
      this.$refs.overview.loadActivities();
    },
  }
}
</script>

