<template>
  <div class="text-center" style="width: 100%">
    <h1 style="display: inline; width: max-content">{{t('overview_for')}}</h1>
    <div class="w-100 d-flex justify-content-center">
      <b-input-group style="max-width: 300px">
        <b-form-select :options="monthOptions"
                       v-model="month"></b-form-select>
        <b-form-select :options="years" v-model="year"></b-form-select>
      </b-input-group>
    </div>
  </div>
  <p class="w-100 text-center mt-2">{{t('total')}}: {{ hours }}</p>

  <slot/>
  <div style="width: 100%; display: flex; justify-content: center">
    <b-card v-if="loaded && activities.length===0" style="width: 25rem; text-align: center; max-width: 100%">
      {{t('no_entries')}}
    </b-card>
    <div v-if="loaded">
      <b-card v-for="(activity) in activities" ref="cards" :key="activity.id" class="mb-2">
        <h5 class="mb-0">{{ activity.from ? d(activity.from, 'long') : "" }}</h5>
        <p class="mb-2">{{
            (activity.to && activity.from) ? humanizeDuration(activity.to?.getTime() - activity.from?.getTime(), {
              language: locale,
              units: ["h", "m"]
            }) : "-"
          }}</p>
        <p class="mb-0 text-muted">{{ activity.task.title }}</p>
        <b-button-group class="mt-2 w-100">
          <b-button variant="outline-primary" @click="editActivity(activity)">{{t('edit')}}</b-button>
          <b-button variant="outline-danger" @click="askToDeleteActivity(activity)">{{t('delete')}}</b-button>
        </b-button-group>
      </b-card>
      <entry-editor v-if="editableActivity" ref="acEditor" :tasks="tasks" :id="editableActivity.id"
                    :initial-data="editableActivity" @on-submit="onEditorSubmit" @on-close="onEditorClose"/>
      <b-modal @ok="deleteActivity" ref="deleteModal" :title="t('delete_entry')" :ok-title="t('delete')" ok-variant="danger" :cancel-title="t('cancel')"
               centered>{{t('delete_prompt')}}
      </b-modal>
    </div>
    <custom-spinner v-else/>
  </div>
</template>

<script lang="ts" setup>
import type {Activity, Task} from "timeclicker_server/src/libindex";
import CustomSpinner from "./CustomSpinner.vue";
import {BCard, BInputGroup, BButtonGroup, BButton, BModal} from "bootstrap-vue";
import axios from "axios";
import humanizeDuration from "humanize-duration";
import EntryEditor from "@/components/EntryEditor.vue";
import {computed, nextTick, onMounted, ref, watch} from "vue";
import {UiError, useErrorStore} from "@/stores/error";
import {useI18n} from "vue-i18n";

const props = defineProps<{ tasks: Array<Task> }>()

const {t, d, locale} = useI18n();

const errorStore = useErrorStore();

const editableActivity = ref<Activity | null>(null)
const acEditor = ref<InstanceType<typeof EntryEditor> | null>(null);
const deleteModal = ref<InstanceType<typeof BModal> | null>(null);

const loaded = ref(false);
const activities = ref<Array<Activity>>([]);
const month = ref((new Date()).getMonth() + 1);

const months = [
  t('months[0]'),
  t('months[1]'),
  t('months[2]'),
  t('months[3]'),
  t('months[4]'),
  t('months[5]'),
  t('months[6]'),
  t('months[7]'),
  t('months[8]'),
  t('months[9]'),
  t('months[10]'),
  t('months[11]'),
]
const monthOptions = computed(() => months.map((val, index) => {
  return {value: index + 1, text: val}
}));

const years = ref<Array<number>>([]);
const year = ref((new Date()).getFullYear());

const hours = computed(() => {
  return humanizeDuration(
      activities.value.reduce((prev: number, curr: Activity) => {
        return prev + ((curr.to?.getTime() || 0) - (curr.from?.getTime() || 0))
      }, 0),
      {language: locale.value, units: ["h", "m"]}
  )
});

function loadActivities() {
  loaded.value = false;
  const startDate = new Date(year.value, month.value - 1, 1)
  const endDate = new Date(year.value, month.value, 0, 23, 59, 59, 999)
  axios.get(import.meta.env.VITE_API_ENDPOINT + "activities", {
    params: {
      from: startDate.toISOString(),
      to: endDate.toISOString()
    }
  }).then(res => {
    activities.value = <Array<Activity>>res.data.map((a: any) => {
      return {
        ...a,
        from: new Date(a.from),
        to: new Date(a.to)
      }
    })
    loaded.value = true;
  }).catch(error => {
    activities.value = [];
    loaded.value = true;
    errorStore.setError(new UiError(t('errors.act_failed'), error));
  });
}

function askToDeleteActivity(activity: Activity) {
  editableActivity.value = activity;
  deleteModal.value?.show();
}

function deleteActivity() {
  if (editableActivity.value) {
    axios.delete(import.meta.env.VITE_API_ENDPOINT + "activities/"+editableActivity.value.id).then(loadActivities)
  }
}

async function editActivity(activity: Activity) {
  editableActivity.value = activity;
  await nextTick()
  acEditor.value?.setVisibility(true);
}

function onEditorClose() {
  editableActivity.value = null;
}

function onEditorSubmit() {
  loadActivities();
}

watch(year, loadActivities);
watch(month, loadActivities);

onMounted(() => {
  loadActivities();
  const currYear = (new Date()).getFullYear();
  for (let i = currYear; i > 2021; i--) {
    years.value.push(i);
  }
});

defineExpose({
  loadActivities
})
</script>

<style scoped>

</style>
