import { defineComponent, nextTick } from 'vue';
import { createPinia } from 'pinia';
import { flushPromises, mount } from '@vue/test-utils';
import axios from 'axios';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import i18n from '@/i18n';
import ActivityEntryEditor from './ActivityEntryEditor.vue';

vi.mock('bootstrap-vue-next', () => ({
    useToastController: () => ({ show: vi.fn() }),
}));

const BModal = defineComponent({
    name: 'BModal',
    props: ['modelValue'],
    emits: ['update:modelValue', 'hidden'],
    template: '<section v-if="modelValue"><slot /></section>',
});

const BForm = defineComponent({
    name: 'BForm',
    emits: ['submit'],
    template: '<form @submit="$emit(\'submit\', $event)"><slot /></form>',
});

const BInput = defineComponent({
    name: 'BInput',
    inheritAttrs: false,
    props: ['modelValue'],
    emits: ['update:modelValue'],
    template:
        '<input v-bind="$attrs" :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" />',
});

const BFormTextarea = defineComponent({
    name: 'BFormTextarea',
    inheritAttrs: false,
    props: ['modelValue'],
    emits: ['update:modelValue'],
    template:
        '<textarea v-bind="$attrs" :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" />',
});

const Multiselect = defineComponent({
    name: 'Multiselect',
    props: ['modelValue', 'options'],
    emits: ['update:modelValue'],
    template: '<div data-test="task-select" />',
});

const stubs = {
    BModal,
    BForm,
    BInput,
    BFormTextarea,
    Multiselect,
    BInputGroup: { template: '<div><slot /></div>' },
    BFormInvalidFeedback: { template: '<div><slot /></div>' },
    BButton: { template: '<button><slot /></button>' },
};

const tasks = [
    {
        id: 'task-open',
        title: 'Open task',
        note_mandatory: false,
        open: true,
        activities: [],
    },
    {
        id: 'task-note',
        title: 'Task requiring a note',
        note_mandatory: true,
        open: true,
        activities: [],
    },
];

function mountEditor(props: Record<string, unknown> = {}) {
    return mount(ActivityEntryEditor, {
        props: { tasks, ...props },
        global: {
            plugins: [createPinia(), i18n],
            stubs,
        },
    });
}

async function openEditor(
    wrapper: ReturnType<typeof mountEditor>,
    taskId = 'task-open'
) {
    wrapper.vm.setTask(taskId);
    wrapper.vm.setVisibility(true);
    await nextTick();
}

describe('ActivityEntryEditor', () => {
    beforeEach(() => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date('2026-08-07T12:00:00Z'));
        vi.spyOn(axios, 'post').mockResolvedValue({ data: {} });
    });

    it('initializes a new entry with the current date', async () => {
        const wrapper = mountEditor();

        await openEditor(wrapper);

        expect(
            wrapper.get<HTMLInputElement>('#date-select').element.value
        ).toBe('2026-08-07');
        expect(wrapper.get<HTMLInputElement>('#breakMins').element.value).toBe(
            '0'
        );
    });

    it('marks the public note as required for mandatory-note tasks', async () => {
        const wrapper = mountEditor();

        await openEditor(wrapper, 'task-note');

        expect(wrapper.get('#note-input').attributes('required')).toBeDefined();
        expect(wrapper.text()).toContain('mandatory');
    });

    it('posts a complete activity and emits submit', async () => {
        const wrapper = mountEditor();
        await openEditor(wrapper);
        await wrapper.get('#date-select').setValue('2026-08-07');
        await wrapper.get('#from-select').setValue('09:00');
        await wrapper.get('#to-select').setValue('17:00');
        await wrapper.get('#breakMins').setValue('30');
        await wrapper.get('#note-input').setValue('Public note');
        await wrapper.get('#private-note-input').setValue('Private note');

        await wrapper.get('form').trigger('submit');
        await flushPromises();

        expect(axios.post).toHaveBeenCalledWith('/api/activities', {
            id: undefined,
            from: new Date('2026-08-07T09:00:00'),
            to: new Date('2026-08-07T17:00:00'),
            note: 'Public note',
            private_note: 'Private note',
            taskId: 'task-open',
            breakMins: '30',
        });
        expect(wrapper.emitted('on-submit')).toHaveLength(1);
    });

    it('does not post when the end is before the start', async () => {
        const wrapper = mountEditor();
        await openEditor(wrapper);
        await wrapper.get('#from-select').setValue('17:00');
        await wrapper.get('#to-select').setValue('09:00');

        await wrapper.get('form').trigger('submit');

        expect(axios.post).not.toHaveBeenCalled();
        expect(wrapper.text()).toContain(
            'The beginning of an entry must be before its end!'
        );
    });

    it('preserves a closed task while editing an existing activity', async () => {
        const closedTask = {
            id: 'task-closed',
            title: 'Closed task',
            note_mandatory: false,
            open: false,
            activities: [],
        };
        const wrapper = mountEditor({
            id: 'activity-1',
            initialData: {
                id: 'activity-1',
                from: new Date('2026-08-06T09:00:00'),
                to: new Date('2026-08-06T10:00:00'),
                note: 'Existing note',
                private_note: 'Existing private note',
                breakMins: 0,
                task: closedTask,
            },
        });

        wrapper.vm.setVisibility(true);
        await nextTick();

        expect(wrapper.get('.multiselect__single').text()).toBe('Closed task');
        expect(
            wrapper.get<HTMLTextAreaElement>('#note-input').element.value
        ).toBe('Existing note');
    });
});
