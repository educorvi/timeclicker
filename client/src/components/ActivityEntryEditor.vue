<template>
    <b-modal
        v-model="visibility"
        :title="t('edit_entry')"
        centered
        size="xl"
        scrollable
        @hidden="onClose"
        no-footer
        no-close-on-backdrop
    >
        <b-form @submit="onSubmit">
            <label for="project-select">{{ t('task') }}:</label>
            <multiselect
                :options="taskOptions"
                v-model="newData.task"
                :searchable="true"
                :allow-empty="false"
                :close-on-select="true"
                :placeholder="t('please_select_task')"
                :selectLabel="t('press_enter_to_select')"
                track-by="value"
                label="text"
                required
            >
            </multiselect>
            <hr />
            <label for="date-select">{{ t('date') }}:</label>
            <b-input
                required
                v-model="newData.date"
                id="date-select"
                type="date"
            ></b-input>
            <label for="from-select" class="mt-3">{{ t('from') }}:</label>
            <b-input
                v-model="newData.from"
                required
                id="from-select"
                type="time"
            ></b-input>
            <b-form-invalid-feedback :state="validTimes"
            >{{ t('beg_of_entry_bef_end') }}
            </b-form-invalid-feedback>
            <label for="to-select" class="mt-3">{{ t('to') }}:</label>
            <b-input
                v-model="newData.to"
                required
                id="to-select"
                type="time"
            ></b-input>
            <b-form-invalid-feedback :state="validTimes"
            >{{ t('beg_of_entry_bef_end') }}
            </b-form-invalid-feedback>

            <label class="mt-3" for="breakMins">{{ t('break') }}:</label>
            <b-input-group append="min">
                <b-input
                    id="breakMins"
                    required
                    type="number"
                    v-model="newData.breakMins"
                ></b-input>
            </b-input-group>
            <hr />
            <label for="note-input"
            >{{ t('note')
                }}{{
                    (
                        tasks.filter((ta) => ta.id === newData.task?.value)[0] || {
                            note_mandatory: false,
                        }
                    ).note_mandatory
                        ? ` (${t('mandatory').toLowerCase()})`
                        : ''
                }}:</label
            >
            <b-form-textarea
                v-model="newData.note"
                :required="
                    (
                        tasks.filter((ta) => ta.id === newData.task?.value)[0] || {
                            note_mandatory: false,
                        }
                    ).note_mandatory
                "
                id="note-input"
                rows="3"
            />

            <label for="private-note-input" class="mt-3"
            >{{ t('private_note') }}:</label
            >
            <b-form-textarea
                v-model="newData.private_note"
                id="private-note-input"
                rows="3"
            />

            <hr />
            <b-button type="submit" variant="primary" class="w-100"
            >{{ t('save') }}
            </b-button>
        </b-form>
    </b-modal>
</template>
<script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue';
import type { ComputedRef } from 'vue';
import type {
    saveActivityParams,
    Task,
    Activity,
} from 'timeclicker_server';
import axios from 'axios';
import { UiError, useErrorStore } from '@/stores/error';
import { useI18n } from 'vue-i18n';
import { useToastController } from 'bootstrap-vue-next';
import Multiselect from 'vue-multiselect'
import 'vue-multiselect/dist/vue-multiselect.min.css';

const { t } = useI18n();

const { show } = useToastController();

const errorStore = useErrorStore();

type TaskOption = { value: string | null; text: string }
function taskToTaskOption(task?: Task): TaskOption | null {
    if (!task) {
        return null;
    }
    return {
        value: task.id,
        text: task.title,
    };
}

//Props
const props = defineProps<{
    tasks: Array<Task>;
    id?: string;
    initialData?: Activity;
}>();

//Data
const newData = ref({
    task: null as TaskOption | null,
    date: '',
    from: '',
    to: '',
    note: '',
    private_note: '',
    breakMins: 0,
});

const validTimes = ref(true);

const emit = defineEmits<{
    (e: 'on-close'): void;
    (e: 'on-submit'): void;
}>();

function getTimeString(date: Date) {
    return (
        String(date.getHours()).padStart(2, '0') +
        ':' +
        String(date.getMinutes()).padStart(2, '0')
    );
}

function initializeData() {
    let from = '',
        to = '',
        date = '';
    if (props.initialData?.from) {
        from = getTimeString(props.initialData.from);
        date = props.initialData.from.toISOString().split('T')[0];
    }
    if (props.initialData?.to) {
        to = getTimeString(props.initialData.to);
        if (!date) {
            date = props.initialData.to.toISOString().split('T')[0];
        }
    }
    if (!date) {
        date = (new Date()).toISOString().split('T')[0]
    }
    newData.value.task = taskToTaskOption(props.initialData?.task) || null;
    newData.value.date = date;
    newData.value.from = from;
    newData.value.to = to;
    newData.value.note = props.initialData?.note || '';
    newData.value.private_note = props.initialData?.private_note || '';
    newData.value.breakMins = props.initialData?.breakMins || 0;
}

const visibility = ref(false);

//Computed
const taskOptions: ComputedRef<{ value: string | null; text: string }[]> =
    computed(() => {
        const res = props.tasks.map(taskToTaskOption).filter((t) => t !== null);

        // If initial data contains a task that is no longer active, add it to the dropdown
        if (
            props.initialData &&
            res.filter((f) => f.value === props.initialData?.task.id).length ===
            0
        ) {
            res.unshift({
                value: props.initialData?.task.id,
                text: props.initialData?.task.title,
            });
        }

        return res;
    });

//Methods
function setVisibility(v: boolean) {
    visibility.value = v;
}

function setTask(id: string) {
    const task = props.tasks.find((t) => t.id === id);
    if (task) {
        newData.value.task = taskToTaskOption(task);
    } else {
        console.error('unknown task: ' + id);
    }
}

function onSubmit(event: Event) {
    event.preventDefault();
    const from = new Date(newData.value.date);
    from.setHours(
        Number.parseInt(newData.value.from.split(':')[0]),
        Number.parseInt(newData.value.from.split(':')[1]),
    );
    const to = new Date(newData.value.date);
    to.setHours(
        Number.parseInt(newData.value.to.split(':')[0]),
        Number.parseInt(newData.value.to.split(':')[1]),
    );
    if (to.getTime() < from.getTime()) {
        validTimes.value = false;
        return;
    } else {
        validTimes.value = true;
    }
    const submitData: saveActivityParams = {
        from: from,
        to: to,
        note: newData.value.note,
        private_note: newData.value.private_note,
        taskId: newData.value.task?.value || '',
        breakMins: newData.value.breakMins,
    };
    axios
        .post(import.meta.env.VITE_API_ENDPOINT + 'activities', {
            id: props.id,
            ...submitData,
        })
        .then(() => {
            visibility.value = false;
            emit('on-submit');
        })
        .catch((error) => {
            errorStore.setError(new UiError(t('errors.saving_failed'), error));
        });
}

function onClose() {
    emit('on-close');
    initializeData();
}

watch(props, initializeData);
onMounted(initializeData);

defineExpose({
    setVisibility,
    id: props.id,
    setTask,
});
</script>

<style lang="scss">
hr {
    margin-left: calc(-1 * var(--bs-modal-padding));
    margin-right: calc(-1 * var(--bs-modal-padding));
}

.multiselect__option.multiselect__option--highlight {
    background-color: var(--bs-primary);

    &::after{
        background-color: var(--bs-primary);
    }
}
</style>
