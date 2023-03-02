<template>
  <div class="w-100 text-center">
    <h1>TimeClicker v{{ version }}</h1>
    <p>Entwickelt von Educorvi</p>
  </div>
  <hr>
  <b-button-group class="w-100">
      <b-button variant="outline-light" v-b-modal.changelog-modal>Changelog</b-button>
    <b-button variant="outline-light" v-b-modal.license-modal>Bibliotheken</b-button>
  </b-button-group>
  <b-modal id="changelog-modal" title="Changelog" size="xl" centered hide-footer scrollable>
    <span v-if="changelog.length" v-html="changelog">
    </span>
    <custom-spinner v-else/>
  </b-modal>
  <b-modal id="license-modal" title="Verwendete Bibliotheken" size="xl" centered hide-footer scrollable>
    <b-card class="mb-4" v-for="license of licenses" :header="`${license.name}@${license.installedVersion} by ${license.author}`">
      <b>Source Code:</b> {{license.link}}
      <hr>
      <div v-if="licenseTexts.get(license.name)">
        <b>License text:</b><br>
        {{licenseTexts.get(license.name)}}
      </div>
      <custom-spinner v-else/>
    </b-card>
  </b-modal>

</template>

<script setup lang="ts">
import {version} from "../../package.json"
import {BCard, BButton, BButtonGroup, BModal} from "bootstrap-vue";
import axios from "axios";
import {onMounted, ref} from "vue";
import CustomSpinner from "@/components/CustomSpinner.vue"
import {Converter} from "showdown"

type License = {
  "name": string,
  "licenseType": string,
  "link": string,
  "installedVersion": string,
  "author": string
}

const changelog = ref("");
const licenses = ref<License[]>([])
const licenseTexts = ref(new Map<string, string>());

onMounted(() => {
  axios.get("/CHANGELOG.md").then(({data}) => {
    const converter = new Converter();
    changelog.value = converter.makeHtml(data);
  });
  axios.get("/licenses.json").then(({data}) => {
    for (const datum of data) {
      licenses.value.push(datum);
    }
    licenses.value.forEach((l) => {
      axios.get("/license-files/" + l.name + ".LICENSE.txt").then(({data}) => {
        licenseTexts.value.set(l.name, data);
      });
    });
  })

});
</script>

<style scoped>

</style>