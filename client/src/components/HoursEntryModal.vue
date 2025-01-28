<template>
    <b-modal
        v-model="visible"
        centered
        :title="t('edit_entry')"
        size="xl"
        scrollable
        no-close-on-backdrop
        no-footer
        @hidden="modelClosed"
    >
        <b-form @submit="saveEntry">
            <div class="mb-2">
                <label for="date-select">{{ t('date') }}:</label>
                <b-input
                    required
                    id="date-select"
                    type="date"
                    v-model="date"
                ></b-input>
            </div>
            <b-row class="mb-3">
                <b-col cols="6">
                    <label for="duration-hours"
                        >{{ t('hour', { count: 2 }) }}:</label
                    >
                    <b-input
                        id="duration-hours"
                        required
                        type="number"
                        step="1"
                        min="0"
                        v-model.number="hours"
                        :disabled="vacation"
                    ></b-input>
                </b-col>
                <b-col cols="6">
                    <label for="duration-min"
                        >{{ t('minute', { count: 2 }) }}:</label
                    >
                    <b-input
                        id="duration-min"
                        required
                        type="number"
                        step="1"
                        min="0"
                        v-model.number="minutes"
                        :disabled="vacation"
                    ></b-input>
                </b-col>
            </b-row>
            <b-form-checkbox v-model="vacation" :disabled="!vacationAvailable">{{
                t('vacation_day')
            }}</b-form-checkbox>
            <hr />
            <b-button type="submit" variant="primary" class="w-100"
                >{{ t('save') }}
            </b-button>
        </b-form>
    </b-modal>
</template>
<script setup lang="ts">
import { HoursType, type saveHourParams, type WorkingHours } from 'timeclicker_server';
import { useI18n } from 'vue-i18n';
import { ref, watch } from 'vue';
import axios from 'axios';
import { UiError, useErrorStore } from '@/stores/error';

const { t } = useI18n();
const errorStore = useErrorStore();

const props = defineProps<{
    /**
     * Data to initialize the form with if an existing entry is edited
     */
    initialData?: WorkingHours;

    /**
     * Are vacation days available
     */
    vacationAvailable: boolean;
}>();

/**
 * Defines if the modal is shown or not
 */
const visible = defineModel<boolean>('visible', {
    required: true,
});

const emit = defineEmits<{
    (e: 'on-submit'): void;
}>();

const date = ref<string>((new Date()).toISOString().split('T')[0]);
const hours = ref<number>(0);
const minutes = ref<number>(0);
const vacation = ref<boolean>(false);

watch(vacation, (newVal) => {
    if (newVal) {
        hours.value = 0;
        minutes.value = 0;
    }
});

function modelClosed() {
    date.value = '';
    hours.value = 0;
    minutes.value = 0;
    vacation.value = false;
}

function saveEntry(evt: Event) {
    evt.preventDefault();
    const dateVal = new Date(date.value);

    const submitData: saveHourParams = {
        date: dateVal,
        duration: hours.value * 60 + minutes.value,
        type: vacation.value ? HoursType.VACATION : HoursType.WORK,
        //@TODO
        note: '',
    };

    axios
        .post(import.meta.env.VITE_API_ENDPOINT + 'hours', {
            id: props.initialData?.id,
            ...submitData,
        })
        .then(() => {
            visible.value = false;
            emit('on-submit');
        })
        .catch((error) => {
            errorStore.setError(new UiError(t('errors.saving_failed'), error));
        });
}
</script>
<style scoped lang="scss">
hr {
    margin-left: calc(-1 * var(--bs-modal-padding));
    margin-right: calc(-1 * var(--bs-modal-padding));
}
</style>
