<template>
  <div v-if="tasks && users">
    <b-card id="filterContainer" :header="t('filter', 2)">
      <b-input-group :prepend="t('from')">
        <b-form-input v-model="from" class="dateInput" type="date"></b-form-input>
      </b-input-group>
      <b-input-group :prepend="t('to')">
        <b-form-input v-model="to" class="dateInput" type="date"></b-form-input>
      </b-input-group>
      <hr>
      <tag-dropdown @change="taskFilterChange" :label="t('task', 2)"
                    :options="tasks.map(u => {return {desc: u.title, id: u.id}})"></tag-dropdown>
      <hr>
      <tag-dropdown @change="userFilterChange" :options="users.map(u => {return {desc: u.name, id: u.id}})"
                    :label="t('user', 2)"></tag-dropdown>
    </b-card>

    <b-button class="w-100 mt-4 mb-4" variant="primary" @click="downloadJSON">{{ t('download') }}</b-button>

    <b>{{ t('total_time') }}: {{ hours }}</b>
    <b-table :tbody-transition-props="{name: 'flip-list'}" striped responsive="sm" :items="tableActivities"
             :fields="fields" primary-key="id"></b-table>
  </div>
  <custom-spinner v-else/>
</template>

<script setup lang="ts">
import {BInputGroup, BFormInput, BCard, BTable, BButton} from "bootstrap-vue";
import {computed, onMounted, ref, watch} from "vue";
import type {Ref} from "vue";
import type {Task, User, Activity} from "../../../server/src/libindex";
import axios from "axios";
import TagDropdown from "@/components/tagDropdown.vue";
import CustomSpinner from "@/App.vue";
import humanizeDuration from "humanize-duration";
import {saveAs} from "file-saver"
import {UiError, useErrorStore} from "@/stores/error";
import {useI18n} from "vue-i18n";
import type {TagOption} from "@/additionalTypes";

const errorStore = useErrorStore();

const tasks: Ref<Array<Task>> = ref([]);
const users: Ref<Array<User>> = ref([]);

const selectedTasks: Ref<Array<Task>> = ref([])
const selectedUsers: Ref<Array<User>> = ref([])

const activities: Ref<Activity[]> = ref([]);

const firstOfMonth = new Date();
firstOfMonth.setDate(1);
const lastOfMonth = new Date();
lastOfMonth.setMonth(lastOfMonth.getMonth() + 1, 0);

const from = ref(firstOfMonth.toISOString().split("T")[0])
const to = ref(lastOfMonth.toISOString().split("T")[0])

const {t, locale} = useI18n();

onMounted(() => {
  axios.get(import.meta.env.VITE_API_ENDPOINT + "tasks").then(res => {
    tasks.value = <Array<Task>>res.data;
  }).catch(error => {
    errorStore.setError(new UiError(t('errors.tasks_failed'), error));
  })

  axios.get(import.meta.env.VITE_API_ENDPOINT + "orga/users").then(res => {
    users.value = <Array<User>>res.data;
  }).catch(error => {
    errorStore.setError(new UiError(t('errors.users_failed'), error));
  })
  loadActivities()
});

function taskFilterChange(newTasks: TagOption[]) {
  selectedTasks.value = newTasks.map(nt => tasks.value.filter(t => t.id === nt.id)[0]);
}

function userFilterChange(newUsers: TagOption[]) {
  selectedUsers.value = newUsers.map(nu => users.value.filter(u => u.id === nu.id)[0]);
}

function loadActivities() {
  const startDate = new Date(from.value);
  const endDate = new Date(to.value);
  endDate.setHours(23, 59, 59, 999);
  axios.get(import.meta.env.VITE_API_ENDPOINT + "orga/activities", {
    params: {
      users: selectedUsers.value.map(u => u.id),
      tasks: selectedTasks.value.map(t => t.id),
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
  }).catch(error => {
    errorStore.setError(new UiError(t('errors.act_failed'), error));
  })
}

const hours = computed(() => {
  return humanizeDuration(
      activities.value.reduce((prev: number, curr: Activity) => {
        return prev + ((curr.to?.getTime() || 0) - (curr.from?.getTime() || 0))
      }, 0),
      {language: locale.value, units: ["h", "m"]}
  )
});

const tableActivities = computed(() => activities.value.map(a => {
  return {
    ...a,
    to: a.to?.toLocaleString(),
    from: a.from?.toLocaleString(),
    duration: humanizeDuration((a.to?.getTime() || 0) - (a.from?.getTime() || 0), {language: locale.value, units: ["h", "m"]})
  }
}));

const fields = ref([
  {
    key: "user.name",
    label: t('user'),
    sortable: true
  },
  {
    key: "task.title",
    label: t('task'),
    sortable: true
  },
  {
    key: "duration",
    label: t('duration'),
    sortable: true
  },
  {
    key: "from",
    label: t('from'),
    sortable: true
  },
  {
    key: "to",
    label: t('to'),
    sortable: true
  }
])

function downloadJSON() {
  const toSave = new Blob([JSON.stringify(activities.value)], {type: 'application/json'})
  saveAs(toSave, "timeclicker.json")
}

watch(from, loadActivities);
watch(to, loadActivities);
watch(selectedTasks, loadActivities);
watch(selectedUsers, loadActivities);
</script>

<style>
#filterContainer > .card-body > * {
  margin-top: 5px;
}

table .flip-list-move {
  transition: transform 1s;
}

table .flip-list-enter-active,
table .flip-list-leave-active {
  transition: opacity 0.5s ease;
}

table .flip-list-enter-from,
table .flip-list-leave-to {
  opacity: 0;
}

</style>
