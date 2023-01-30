<template>
  <div v-if="tasks && users">
    <b-card id="filterContainer" header="Filter">
      <b-input-group prepend="Von">
        <b-form-input class="dateInput" type="date"></b-form-input>
      </b-input-group>
      <b-input-group prepend="Bis">
        <b-form-input class="dateInput" type="date"></b-form-input>
      </b-input-group>
      <hr>
      <tag-dropdown @change="taskFilterChange" label="Aufgaben" :options="tasks.map(u => {return {desc: u.title, id: u.id}})"></tag-dropdown>
      <hr>
      <tag-dropdown @change="userFilterChange" :options="users.map(u => {return {desc: u.name, id: u.id}})" label="Nutzer"></tag-dropdown>
    </b-card>
  </div>
  <custom-spinner v-else/>


  {{selectedTasks}}
</template>

<script setup lang="ts">
import {BInputGroup, BFormInput, BCard} from "bootstrap-vue";
import {onMounted, ref} from "vue";
import type {Ref} from "vue";
import type {Task, User} from "timeclicker_server";
import axios from "axios";
import TagDropdown from "@/components/tagDropdown.vue";
import type {TagOption} from "@/components/tagDropdown.vue";
import CustomSpinner from "@/App.vue";


const tasks: Ref<Array<Task>> = ref([]);
const users: Ref<Array<User>> = ref([]);

const selectedTasks: Ref<Array<Task>> = ref([])
const selectedUsers: Ref<Array<Task>> = ref([])

onMounted(() => {
  axios.get(import.meta.env.VITE_API_ENDPOINT + "tasks").then(res => {
    tasks.value = <Array<Task>>res.data;
  })
  axios.get(import.meta.env.VITE_API_ENDPOINT + "orga/users").then(res => {
    users.value = <Array<User>>res.data;
  })
});

function taskFilterChange(newTasks: Ref<Array<TagOption>>) {
  selectedTasks.value = newTasks.value.map(nt => tasks.value.filter(t => t.id === nt.id)[0]);
}
function userFilterChange(newUsers: Ref<Array<TagOption>>) {
  console.log(newUsers.value);
}
</script>

<style scoped>
#filterContainer > .card-body > * {
  margin-top: 5px;
}
</style>
