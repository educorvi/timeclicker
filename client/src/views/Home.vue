<template>
  <div style="display: flex; width: 100%; justify-content: center">
      <b-button v-b-modal.new-entry-modal variant="primary" style="max-width: 400px" class="w-100">Neuer Eintrag</b-button>
  </div>

  <overview ref="overview"/>

  <b-modal v-model="modalVisible" id="new-entry-modal" title="Neuer Eintrag" centered size="xl" scrollable
           @hidden="onClose" hide-footer no-close-on-backdrop>
    <b-form @submit="onSubmit">
      <label for="project-select">Projekt:</label>
      <b-form-select id="project-select" required v-model="newData.task"
                     :options="[{value: null, text: 'Bitte wähle ein Projekt'}].concat(tasks.map(t => {return {value: t.id, text: t.title}}))"/>
      <hr>
      <label for="date-select">Datum:</label>
      <b-input v-model="newData.date" required id="date-select" type="date"></b-input>
      <label for="from-select" class="mt-3">Von:</label>
      <b-input v-model="newData.from" required id="from-select" type="time"></b-input>
      <label for="to-select" class="mt-3">Bis:</label>
      <b-input v-model="newData.to" required id="to-select" type="time"></b-input>
      <hr>
      <label
          for="note-input">Notiz{{ (tasks.filter(t => t.id === newData.task)[0] || {note_mandatory: false}).note_mandatory ? " (verpflichtend)" : "" }}:</label>
      <b-form-textarea v-model="newData.note"
                       :required="(tasks.filter(t => t.id === newData.task)[0]||{note_mandatory: false}).note_mandatory"
                       id="note-input" rows="3"/>

      <label for="private-note-input" class="mt-3">Private Notiz:</label>
      <b-form-textarea v-model="newData.private_note" id="private-note-input" rows="3"/>

      <hr>

      <b-button type="submit" variant="primary" class="w-100">Speichern</b-button>
    </b-form>
  </b-modal>
</template>

<script lang="ts">
import {BButton, BFormTextarea} from "bootstrap-vue";
import axios from "axios";
import type {createActivityParams, Task} from "timeclicker_server";
import Overview from "@/components/Overview.vue";

export default {
  name: "Home",
  components: {Overview, BButton, BFormTextarea},
  data() {
    return {
      tasks: [] as Array<Task>,
      newData: {
        task: null as string | null,
        date: "",
        from: "",
        to: "",
        note: "",
        private_note: ""
      },
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
    onSubmit(event: Event) {
      event.preventDefault()
      const from = new Date(this.newData.date);
      from.setHours(this.newData.from.split(":")[0], this.newData.from.split(":")[1])
      const to = new Date(this.newData.date);
      to.setHours(this.newData.to.split(":")[0], this.newData.to.split(":")[1])
      if (to.getTime() < from.getTime()) {
        this.$bvToast.toast('Die Uhrzeit "Von" muss vor der Uhrzeit "Bis" sein!', {
          title: "Fehler",
          variant: "danger",
          autoHideDelay: 20000
        })
        return;
      }
      const submitData: createActivityParams = {
        from: from.toISOString(),
        to: to.toISOString(),
        note: this.newData.note,
        private_note: this.newData.private_note,
        taskId: this.newData.task
      };
      axios.post(import.meta.env.VITE_API_ENDPOINT + "activities/create", submitData).then(() => {
        this.modalVisible = false;
        this.$refs.overview.loadActivities();

      }).catch(err => {
        this.$bvToast.toast('Aktivität konnte nicht gespeichert werden: '+err.title, {
          title: "Fehler",
          variant: "danger",
          autoHideDelay: 20000
        })
      });
    },
    onClose() {
      for (const key of Object.keys(this.newData)) {
        this.newData[key] = "";
      }
      this.newData.task = null;
    },
  }
}
</script>

<style scoped>

</style>
