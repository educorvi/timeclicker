<template>
     <div class="text-center" style="width: 100%">
        <h1 class="w-100 mb-2 mt-2">
            {{ t('overview_for') }}
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
    <div class="w-100 text-center mt-3">
        <b-button variant="primary" @click="modalVisible=true">
        {{ t('new_entry') }}
    </b-button>
    </div>

    <HoursEntryModal v-model:visible="modalVisible"/>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { getMonthOptions, years } from '@/commons/DateUtils';
import { ref } from 'vue';

const { t } = useI18n();

const monthOptions = getMonthOptions(t);

const month = ref(new Date().getMonth() + 1);
const year = ref(new Date().getFullYear());

const modalVisible = ref(false);
</script>

<style scoped></style>
