<template>
<h1>TimeClicker v{{version}}</h1>
  <p>Entwickelt von Educorvi</p>
  <hr>
  <b-card header="Changelog">
    <span v-if="changelog.length" v-html="changelog">
    </span>
    <custom-spinner v-else/>
  </b-card>
</template>

<script setup lang="ts">
import {version} from "../../package.json"
import {BCard} from "bootstrap-vue";
import axios from "axios";
import {onMounted, ref} from "vue";
import CustomSpinner from "@/components/CustomSpinner.vue"
import {Converter} from "showdown"

const converter = new Converter();

const changelog = ref("");

onMounted(() => {
  axios.get("/CHANGELOG.md").then(res => {
    changelog.value = converter.makeHtml(res.data);
  });
});
</script>

<style scoped>

</style>
