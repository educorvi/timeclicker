<template>
    <div class="text-center" style="width: 100%">
        <h1 style="display: inline; width: max-content">
            {{ t('working_hour', {count: 2}) }}
        </h1>
        <div class="w-100 d-flex justify-content-center">
            <b-input-group style="max-width: 300px">
                <b-form-select
                    :options="monthOptions"
                    v-model="month"
                ></b-form-select>
                <b-form-select :options="years" v-model="year"></b-form-select>
            </b-input-group>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { BInputGroup } from 'bootstrap-vue';
import { getMonthOptions, years } from '@/commons/DateUtils';
import { ref } from 'vue';

const { t } = useI18n();

const monthOptions = getMonthOptions(t);

const month = ref(new Date().getMonth() + 1);
const year = ref(new Date().getFullYear());
</script>

<style scoped></style>
