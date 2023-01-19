<template>
  <div id="customSpinner">
    <b-spinner/>
  </div>
</template>
<script lang="ts">
import {BSpinner} from "bootstrap-vue";

export default {
  name: 'customSpinner',
  components: {BSpinner}
}
</script>

<style>
#customSpinner {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
</style>
