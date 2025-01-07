<template>
    <b-modal
        centered
        size="xl"
        scrollable
        no-footer
        no-close-on-backdrop
        :title="t('edit_contract_data')"
        @hidden="()=>{modalHidden = true}"
        @show="()=>{modalHidden = false}"
    >
        <vue-json-form
            v-if="!modalHidden"
            class="w-100"
            :jsonSchema="jsonSchema"
            :uiSchema="uiSchema"
            :on-submit-form="saveContract"
        />
    </b-modal>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import type { ContractData, saveContractDataParams } from 'timeclicker_server';
import { ref } from 'vue';
import {
    getContractEntryJsonSchema,
    getContractEntryUiSchema,
} from '@/formSchemas/ContractEntry';
import { VueJsonForm } from '@educorvi/vue-json-form';
import axios from 'axios';
import { UiError, useErrorStore } from '@/stores/error';

const errorStore = useErrorStore();

const { t } = useI18n();

const jsonSchema = getContractEntryJsonSchema(t);
const uiSchema = getContractEntryUiSchema(t);

const modalHidden = ref(false);

const props = defineProps<{
    initialData?: saveContractDataParams;
    cleanAfterSubmit?: boolean;
    selectedUserId: string;
}>();

const emit = defineEmits<{
    (e: 'on-submit'): void;
}>();

function saveContract(data: Record<string, any>) {
    const contractData: saveContractDataParams = {
        hoursPerWeek: data.hoursPerWeek,
        daysPerWeek: data.daysPerWeek,
        vacationDays: data.vacationDays,
        startMonth: Number.parseInt(data.startMonth),
        startYear: data.startYear,
        userId: props.selectedUserId,
    };
    axios
        .post(
            import.meta.env.VITE_API_ENDPOINT + 'orga/contract-data',
            contractData
        )
        .then(() => {
            emit('on-submit');
        })
        .catch((error) => {
            errorStore.setError(new UiError(t('errors.saving_failed'), error));
        });
}
</script>

<style scoped></style>
