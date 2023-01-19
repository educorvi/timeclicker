<template>
  <h1 class="w-100 text-center mt-4 mb-n4">Übersicht für {{ String(month).padStart(2, '0') }}.{{ year }}</h1>
  <p class="w-100 text-center mt-4">Arbeitszeit in diesem Monat: {{hours}}</p>

  <b-card v-if="loaded && activities.length===0" style="width: 25rem; text-align: center; max-width: 100%">
    Für diesen Monat liegen noch keine Einträge vor
  </b-card>
  <div v-if="loaded">
    <b-card v-for="activity in activities" class="mb-2">
      <h5 class="mb-0">{{new Date(activity.from).toLocaleDateString()}}</h5>
      <p class="mb-2">{{humanizeDuration(activity.to?.getTime()-activity.from?.getTime())}}</p>
      <p class="mb-0 text-muted">{{activity.task.title}}</p>
    </b-card>
  </div>
  <custom-spinner v-else/>
</template>

<script lang="ts">
import type {Activity} from "timeclicker_server";
import CustomSpinner from "./CustomSpinner.vue";
import {BCard} from "bootstrap-vue";
import axios from "axios";
import humanizeDuration from "humanize-duration";

export default {
  name: "Overview",
  components: {CustomSpinner, BCard},
  props: {
    month: {type: Number, required: true},
    year: {type: Number, required: true}
  },
  data() {
    return {
      loaded: false,
      activities: [] as Array<Activity>
    }
  },
  methods: {
    humanizeDuration,
    loadActivities() {
      this.loaded = false;
      const startDate = new Date(this.year, this.month-1, 1)
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
      }).catch(() => {
        this.$bvToast.toast('Fehler beim Abrufen der Einträge.', {
          title: "Fehler",
          variant: "danger",
          autoHideDelay: 20000
        })
      });
    },
  },
  mounted() {
    this.loadActivities();
  },
  computed: {
    hours(){
      return humanizeDuration(
          this.activities.reduce((prev: number, curr: Activity) => {
            return prev + ((curr.to?.getTime() || 0)-(curr.from?.getTime()||0))
          }, 0)
      )
    }
  },
}
</script>

<style scoped>

</style>
