<template>
  <b-modal v-model="visibility" :title="t('edit_entry')" centered size="xl" scrollable
           @hidden="onClose" hide-footer no-close-on-backdrop>
    <b-form @submit="onSubmit">
      <label for="project-select">{{t('task')}}:</label>
      <b-form-select id="project-select" required v-model="newData.task"
                     :options="taskOptions"/>
      <hr>
      <label for="date-select">{{t('date')}}:</label>
      <b-input required v-model="newData.date" id="date-select" type="date"></b-input>
      <label for="from-select" class="mt-3">{{t('from')}}:</label>
      <b-input v-model="newData.from" required id="from-select" type="time"></b-input>
      <b-form-invalid-feedback :state="validTimes">{{t('beg_of_entry_bef_end')}}</b-form-invalid-feedback>
      <label for="to-select" class="mt-3">{{t('to')}}:</label>
      <b-input v-model="newData.to" required id="to-select" type="time"></b-input>
      <b-form-invalid-feedback :state="validTimes">{{t('beg_of_entry_bef_end')}}</b-form-invalid-feedback>

      <label class="mt-3" for="breakMins">{{t('break')}}:</label>
      <b-input-group append="min">
        <b-input id="breakMins" required type="number" v-model="newData.breakMins"></b-input>
      </b-input-group>
      <hr>
      <label
          for="note-input">{{t('note')}}{{
          (tasks.filter(t => t.id === newData.task)[0] || {note_mandatory: false}).note_mandatory ? ` (${t('mandatory').toLowerCase()})` : ""
        }}:</label>
      <b-form-textarea v-model="newData.note"
                       :required="(tasks.filter(t => t.id === newData.task)[0]||{note_mandatory: false}).note_mandatory"
                       id="note-input" rows="3"/>

      <label for="private-note-input" class="mt-3">{{t('private_note')}}:</label>
      <b-form-textarea v-model="newData.private_note" id="private-note-input" rows="3"/>

      <hr>
      <b-button type="submit" variant="primary" class="w-100">{{t('save')}}</b-button>
    </b-form>
  </b-modal>
</template>
<script lang="ts" setup>
import {BFormInput as BInput, BFormTextarea, BButton, BFormInvalidFeedback, BInputGroup} from "bootstrap-vue";
import {computed, onMounted, ref, watch} from "vue";
import type {ComputedRef} from "vue";
import type {saveActivityParams, Task, Activity} from "../../../server/src/libindex";
import axios from "axios";
import {UiError, useErrorStore} from "@/stores/error";
import {useI18n} from "vue-i18n";

const {t} = useI18n();

const errorStore = useErrorStore();

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
  private_note: "",
  breakMins: 0
})

const validTimes = ref(true);

const emit = defineEmits<{
  (e: 'on-close'): void
  (e: 'on-submit'): void
}>()

function getTimeString(date: Date) {
  return String(date.getHours()).padStart(2,"0") + ":" + String(date.getMinutes()).padStart(2,"0");
}

function initializeData() {


  let from = "", to = "", date = "";
  if (props.initialData?.from) {
    from = getTimeString(props.initialData.from)
    date = props.initialData.from.toISOString().split("T")[0]
  }
  if (props.initialData?.to) {
    to = getTimeString(props.initialData.to)
    if (!date) {
      date = props.initialData.to.toISOString().split("T")[0]
    }
  }
  newData.value.task = props.initialData?.task.id || null;
  newData.value.date = date;
  newData.value.from = from;
  newData.value.to = to;
  newData.value.note = props.initialData?.note || "";
  newData.value.private_note = props.initialData?.private_note || "";
  newData.value.breakMins = props.initialData?.breakMins || 0;
}

const visibility = ref(false)


//Computed
const taskOptions: ComputedRef<{ value: string | null, text: string }[]> = computed(() => [{
  value: null as string | null,
  text: t('please_select_task')
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
  if (to.getTime() < from.getTime()) {
    validTimes.value = false;
    return;
  } else {
    validTimes.value = true;
  }
  const submitData: saveActivityParams = {
    from: from,
    to: to,
    note: newData.value.note,
    private_note: newData.value.private_note,
    taskId: newData.value.task || "",
    breakMins: newData.value.breakMins
  };
  axios.post(import.meta.env.VITE_API_ENDPOINT + "activities", {id: props.id, ...submitData}).then(() => {
    visibility.value = false
    emit("on-submit");
  }).catch(error => {
    errorStore.setError(new UiError(t('errors.saving_failed'), error));})
}

function onClose() {
  emit("on-close");
  // initializeData();
}

watch(props, initializeData);
onMounted(initializeData)

defineExpose({
  setVisibility,
  id: props.id
})
</script>
