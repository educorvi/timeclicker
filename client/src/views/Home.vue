<template>
  <div style="display: flex; width: 100%; justify-content: center">
    <b-button v-b-modal.new-entry-modal variant="success">Neuer Eintrag</b-button>
  </div>

  <b-modal id="new-entry-modal" title="Neuer Eintrag" centered size="xl">
    <b-form @submit="onSubmit">
      <label for="project-select">Projekt:</label>
      <b-form-select id="project-select" required v-model="newData.task" :options="[{value: null, text: 'Bitte wähle ein Projekt'}].concat(tasks.map(t => {return {value: t.id, text: t.title}}))"/>
      <hr>
      <label for="date-select">Datum:</label>
      <b-input v-model="newData.date" required id="date-select" type="date"></b-input>
      <label for="from-select" class="mt-3">Von:</label>
      <b-input v-model="newData.from" required id="from-select" type="time"></b-input>
      <label for="to-select" class="mt-3">Bis:</label>
      <b-input v-model="newData.to" required id="to-select" type="time"></b-input>
      <hr>
      <label for="note-input">Notiz{{(tasks.filter(t => t.id === newData.task)[0]||{note_mandatory: false}).note_mandatory?" (verpflichtend)":""}}:</label>
      <b-form-textarea v-model="newData.note" :required="(tasks.filter(t => t.id === newData.task)[0]||{note_mandatory: false}).note_mandatory" id="note-input" rows="3"/>

      <label for="private-note-input" class="mt-3">Private Notiz:</label>
      <b-form-textarea v-model="newData.private_note" id="private-note-input" rows="3"/>

<!--      <b-button type="submit" variant="primary">Speichern</b-button>-->
    </b-form>
  </b-modal>
</template>

<script lang="ts">
import {BButton, BFormTextarea} from "bootstrap-vue";
import axios from "axios";
import type {Task} from "timeclicker_server";

export default {
  name: "Home",
  components: {BButton, BFormTextarea},
  data() {
    return {
      tasks: [] as Array<Task>,
      newData: {
        task: "",
        date: "",
        from: "",
        to: "",
        note: "",
        private_note: ""
      }
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
      console.log(JSON.stringify(this.newData));
    },
  }
}
</script>

<style scoped>

</style>
