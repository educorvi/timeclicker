<template>
  <div class="mt-4 text-center" style="width: 100%">
    <h1 style="display: inline; width: max-content">Übersicht für </h1>
    <div class="w-100 d-flex justify-content-center">
      <b-input-group style="max-width: 300px">
        <b-form-select :options="months.map((val, index)=> {return {value: index+1, text: val}})"
                       v-model="month"></b-form-select>
        <b-form-select :options="years" v-model="year"></b-form-select>
      </b-input-group>
    </div>
  </div>
  <p class="w-100 text-center mt-2">Arbeitszeit in diesem Monat: {{ hours }}</p>

  <div style="width: 100%; display: flex; justify-content: center">
    <b-card v-if="loaded && activities.length===0" style="width: 25rem; text-align: center; max-width: 100%">
      Für diesen Monat liegen noch keine Einträge vor
    </b-card>
    <div v-if="loaded">
      <b-card v-for="activity in activities" class="mb-2">
        <h5 class="mb-0">{{ new Date(activity.from).toLocaleDateString() }}</h5>
        <p class="mb-2">{{ humanizeDuration(activity.to?.getTime() - activity.from?.getTime()) }}</p>
        <p class="mb-0 text-muted">{{ activity.task.title }}</p>
      </b-card>
    </div>
    <custom-spinner v-else/>
  </div>
</template>

<script lang="ts">
import type {Activity} from "timeclicker_server";
import CustomSpinner from "./CustomSpinner.vue";
import {BCard, BInputGroup} from "bootstrap-vue";
import axios from "axios";
import humanizeDuration from "humanize-duration";

export default {
  name: "Overview",
  components: {CustomSpinner, BCard, BInputGroup},
  data() {
    return {
      loaded: false,
      activities: [] as Array<Activity>,
      month: (new Date()).getMonth() + 1,
      months: [
        "Januar",
        "Februar",
        "März",
        "April",
        "Mai",
        "Juni",
        "Juli",
        "August",
        "September",
        "Oktober",
        "November",
        "Dezember"
      ],
      years: [],
      year: (new Date()).getFullYear()
    }
  },
  methods: {
    humanizeDuration,
    loadActivities() {
      this.loaded = false;
      const startDate = new Date(this.year, this.month - 1, 1)
      const endDate = new Date(this.year, this.month, 0, 23, 59, 59, 999)
      axios.get(import.meta.env.VITE_API_ENDPOINT + "activities", {
        params: {
          from: startDate.toISOString(),
          to: endDate.toISOString()
        }
      }).then(res => {
        this.activities = <Array<Activity>>res.data.map((a: any) => {
          return {
            ...a,
            from: new Date(a.from),
            to: new Date(a.to)
          }
        })
        this.loaded = true;
      }).catch((e) => {
        this.$bvToast.toast('Fehler beim Abrufen der Einträge.', {
          title: "Fehler",
          variant: "danger",
          autoHideDelay: 20000
        })
        console.error(e)
      });
    },
  },
  mounted() {
    this.loadActivities();
    const currYear = (new Date()).getFullYear();
    for (let i = currYear; i > 2021; i--) {
      this.years.push(i);
    }
  },
  computed: {
    hours() {
      return humanizeDuration(
          this.activities.reduce((prev: number, curr: Activity) => {
            return prev + ((curr.to?.getTime() || 0) - (curr.from?.getTime() || 0))
          }, 0)
      )
    }
  },
  watch: {
    year() {
      this.loadActivities();
    },
    month() {
      this.loadActivities();
    },
  }
}
</script>

<style scoped>

</style>
