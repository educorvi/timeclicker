<template>
    <div>
        <div v-if="users !== null">
            <b-form-select :options="userOptions" v-model="selectedUser">
                <template #first>
                    <BFormSelectOption :value="null" disabled>
                        {{ t('please_select_user') }}...
                    </BFormSelectOption>
                </template>
            </b-form-select>
        </div>
        <custom-spinner v-else />
    </div>
    <div v-if="selectedUser" class="mt-3">
        <div v-if="contractData !== null">
            <BTableSimple striped>
                <BThead>
                    <BTr>
                        <BTh>{{ t('start_year') }}</BTh>
                        <BTh>{{ t('start_month') }}</BTh>
                        <BTh>{{ t('hours_per_week') }}</BTh>
                        <BTh>{{ t('days_per_week') }}</BTh>
                        <BTh>{{ t('vacation_days') }}</BTh>
                        <BTh>{{ t('action') }}</BTh>
                    </BTr>
                </BThead>
                <BTbody>
                    <BTr v-for="contract in contractData">
                        <BTd>{{ contract.startYear }}</BTd>
                        <BTd>{{ t(`months[${contract.startMonth - 1}]`) }}</BTd>
                        <BTd>{{ contract.hoursPerWeek }}</BTd>
                        <BTd>{{ contract.daysPerWeek }}</BTd>
                        <BTd>{{ contract.vacationDays }}</BTd>
                        <BTd>
                            <BButton
                                variant="danger"
                                class="contract-delete-button"
                                @click="() => deleteContract(contract.id)"
                            >
                                <i-bi-trash3 />
                            </BButton>
                        </BTd>
                    </BTr>
                </BTbody>
            </BTableSimple>
        </div>
        <custom-spinner v-else />
    </div>
    <b-button
        class="w-100 mt-3"
        variant="primary"
        :disabled="!selectedUser"
        @click="modalFunctions[-1].show"
    >
        {{ t('new_entry') }}
    </b-button>
    <contract-entry-modal
        v-if="selectedUser"
        id="new_entry"
        :selected-user-id="selectedUser"
        @onSubmit="
            () => {
                modalFunctions[-1].hide();
                loadContractData();
            }
        "
    />
</template>

<script setup lang="ts">
import {
    computed,
    type ComputedRef,
    onMounted,
    type Ref,
    ref,
    watch,
} from 'vue';
import type { ContractData, User } from 'timeclicker_server';
import axios from 'axios';
import { UiError, useErrorStore } from '@/stores/error';
import { useI18n } from 'vue-i18n';
import { useModal } from 'bootstrap-vue-next';

const errorStore = useErrorStore();

const { t } = useI18n();

const users: Ref<User[] | null> = ref(null);
const selectedUser: Ref<User['id'] | null> = ref(null);

const contractData: Ref<ContractData[] | null> = ref([]);

const userOptions = computed(() => {
    if (!users.value) return [];

    return users.value.map((user) => ({ value: user.id, text: user.name }));
});

const modalFunctions: Ref<Array<{ show: () => void; hide: () => void }>> =
    computed(() => {
        const ret = [];
        ret[-1] = {
            show: useModal('new_entry').show,
            hide: useModal('new_entry').hide,
        };
        contractData.value?.forEach((_, index) => {
            ret[index] = {
                show: useModal('new_entry_' + index).show,
                hide: useModal('new_entry_' + index).hide,
            };
        });
        return ret;
    });

function loadContractData() {
    if (!selectedUser.value) return;
    contractData.value = null;

    axios
        .get(import.meta.env.VITE_API_ENDPOINT + 'orga/contract-data', {
            params: { userId: selectedUser.value },
        })
        .then((res) => {
            contractData.value = <ContractData[]>res.data;
        })
        .catch((error) => {
            errorStore.setError(
                new UiError(t('errors.contract_data_failed'), error)
            );
        });
}

function deleteContract(id: string) {
    axios
        .delete(import.meta.env.VITE_API_ENDPOINT + 'orga/contract-data/' + id)
        .then(() => {
            loadContractData();
        })
        .catch((error) => {
            errorStore.setError(
                new UiError(t('errors.deleting_contract_failed'), error)
            );
        });
}

onMounted(() => {
    axios
        .get(import.meta.env.VITE_API_ENDPOINT + 'orga/users')
        .then((res) => {
            users.value = <Array<User>>res.data;
        })
        .catch((error) => {
            errorStore.setError(new UiError(t('errors.users_failed'), error));
        });
});

watch(selectedUser, loadContractData);
</script>

<style scoped>
.contract-delete-button {
    display: flex;
    justify-content: center;
    vertical-align: center;

    & > * {
        height: 1.3rem;
    }
}
</style>
