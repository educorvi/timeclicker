<template>
  <b-modal v-model="visibility" title="Neuer Eintrag" centered size="xl" scrollable
           @hidden="onClose" hide-footer no-close-on-backdrop>
    <b-form @submit="onSubmit">
      <label for="project-select">Projekt:</label>
      <b-form-select id="project-select" required v-model="newData.task"
                     :options="taskOptions"/>
      <hr>
      <label for="date-select">Datum:</label>
      <b-input required v-model="newData.date" id="date-select" type="date"></b-input>
      <label for="from-select" class="mt-3">Von:</label>
      <b-input v-model="newData.from" required id="from-select" type="time"></b-input>
      <label for="to-select" class="mt-3">Bis:</label>
      <b-input v-model="newData.to" required id="to-select" type="time"></b-input>
      <hr>
      <label
          for="note-input">Notiz{{
          (tasks.filter(t => t.id === newData.task)[0] || {note_mandatory: false}).note_mandatory ? " (verpflichtend)" : ""
        }}:</label>
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
<script lang="ts" setup>
import type {Task, Activity} from "timeclicker_server";
import {BFormInput as BInput, BFormTextarea, BButton} from "bootstrap-vue";
import {computed, onMounted, ref} from "vue";
import type {ComputedRef} from "vue";
import type {saveActivityParams} from "timeclicker_server/src/controllers";
import axios from "axios";

//Props
const props = defineProps<{
  tasks: Array<Task>,
  id?: string,
  initialData?: Activity
}>()

//Data
const newData = ref({
  task: null as string | null,
  date: "",
  from: "",
  to: "",
  note: "",
  private_note: ""
})

const emit = defineEmits<{
  (e: 'on-close'): void
  (e: 'on-submit'): void
}>()

function initializeData() {
  let from = "", to = "", date = "";
  if (props.initialData?.from) {
    from = props.initialData.from.getHours() + ":" + props.initialData.from.getMinutes();
    date = props.initialData.from.toISOString().split("T")[0]
  }
  if (props.initialData?.to) {
    to = props.initialData.to.getHours() + ":" + props.initialData.to.getMinutes();
  }
  newData.value.task = props.initialData?.task.id || null;
  newData.value.date = date;
  newData.value.from = from;
  newData.value.to = to;
  newData.value.note = props.initialData?.note || "";
  newData.value.private_note = props.initialData?.private_note || "";
}

const visibility = ref(false)


//Computed
const taskOptions: ComputedRef<{ value: string | null, text: string }[]> = computed(() => [{
  value: null as string | null,
  text: 'Bitte wähle ein Projekt'
}].concat(props.tasks.map(t => {
  return {value: t.id, text: t.title}
})));


//Methods
function setVisibility(v: boolean) {
  visibility.value = v;
}

function onSubmit(event: Event) {
  event.preventDefault();
  const from = new Date(newData.value.date);
  from.setHours(Number.parseInt(newData.value.from.split(":")[0]), Number.parseInt(newData.value.from.split(":")[1]))
  const to = new Date(newData.value.date);
  to.setHours(Number.parseInt(newData.value.to.split(":")[0]), Number.parseInt(newData.value.to.split(":")[1]))
  // if (to.getTime() < from.getTime()) {
  //   this.$bvToast.toast('Die Uhrzeit "Von" muss vor der Uhrzeit "Bis" sein!', {
  //     title: "Fehler",
  //     variant: "danger",
  //     autoHideDelay: 20000
  //   })
  //   return;
  // }
  const submitData: saveActivityParams = {
    from: from,
    to: to,
    note: newData.value.note,
    private_note: newData.value.private_note,
    taskId: newData.value.task || ""
  };
  axios.post(import.meta.env.VITE_API_ENDPOINT + "activities", {id: props.id, ...submitData}).then(() => {
    visibility.value = false
    emit("on-submit");
  })
  //     .catch(err => {
  //   this.$bvToast.toast('Aktivität konnte nicht gespeichert werden: ' + err.title, {
  //     title: "Fehler",
  //     variant: "danger",
  //     autoHideDelay: 20000
  //   })
  // });
}

function onClose() {
  emit("on-close");
  initializeData();
}

onMounted(initializeData)

defineExpose({
  setVisibility,
  id: props.id
})
</script>
