import { defineComponent, h } from 'vue';
import { createPinia } from 'pinia';
import { flushPromises, mount } from '@vue/test-utils';
import { createMemoryHistory, createRouter } from 'vue-router';
import axios from 'axios';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import i18n from '@/i18n';
import { useErrorStore } from '@/stores/error';
import Activities from './Activities.vue';

const loadActivities = vi.fn();
const setTask = vi.fn();
const setVisibility = vi.fn();

const Overview = defineComponent({
    name: 'Overview',
    props: ['tasks'],
    setup(_, { expose, slots }) {
        expose({ loadActivities });
        return () => h('div', { 'data-test': 'overview' }, slots.default?.());
    },
});

const EntryEditor = defineComponent({
    name: 'EntryEditor',
    props: ['tasks'],
    emits: ['on-submit'],
    setup(_, { expose }) {
        expose({ setTask, setVisibility });
        return () => h('div', { 'data-test': 'entry-editor' });
    },
});

const tasks = [
    {
        id: 'task-open',
        title: 'Open task',
        note_mandatory: false,
        open: true,
        activities: [],
    },
];

async function mountActivities(initialPath = '/') {
    const pinia = createPinia();
    const router = createRouter({
        history: createMemoryHistory(),
        routes: [
            {
                path: '/',
                component: Activities,
            },
        ],
    });
    await router.push(initialPath);
    await router.isReady();

    return {
        pinia,
        router,
        wrapper: mount(Activities, {
            global: {
                plugins: [pinia, router, i18n],
                stubs: {
                    Overview,
                    EntryEditor,
                    BButton: { template: '<button><slot /></button>' },
                },
            },
        }),
    };
}

describe('Activities view', () => {
    beforeEach(() => {
        loadActivities.mockReset();
        setTask.mockReset();
        setVisibility.mockReset();
        vi.spyOn(axios, 'get').mockResolvedValue({ data: tasks });
    });

    it('loads only open tasks', async () => {
        const { wrapper } = await mountActivities();
        await flushPromises();

        expect(axios.get).toHaveBeenCalledWith('/api/tasks?open=true');
        expect(wrapper.getComponent(Overview).props('tasks')).toEqual(tasks);
        expect(wrapper.getComponent(EntryEditor).props('tasks')).toEqual(tasks);
    });

    it('opens a task deep link and removes its query parameters', async () => {
        const { router } = await mountActivities(
            '/?action=createTask&taskID=task-open'
        );
        await flushPromises();

        expect(setTask).toHaveBeenCalledWith('task-open');
        expect(setVisibility).toHaveBeenCalledWith(true);
        expect(router.currentRoute.value.query).toEqual({});
    });

    it('refreshes the overview after an activity is saved', async () => {
        const { wrapper } = await mountActivities();
        await flushPromises();

        wrapper.getComponent(EntryEditor).vm.$emit('on-submit');

        expect(loadActivities).toHaveBeenCalledTimes(1);
    });

    it('clears tasks and records an error when task loading fails', async () => {
        vi.mocked(axios.get).mockRejectedValueOnce(new Error('network error'));
        const consoleError = vi
            .spyOn(console, 'error')
            .mockImplementation(() => undefined);
        const consoleLog = vi
            .spyOn(console, 'log')
            .mockImplementation(() => undefined);

        const { pinia, wrapper } = await mountActivities();
        await flushPromises();

        expect(wrapper.getComponent(Overview).props('tasks')).toEqual([]);
        expect(useErrorStore(pinia).errors).toHaveLength(1);
        expect(consoleError).toHaveBeenCalled();
        expect(consoleLog).toHaveBeenCalledWith('No toast service available');
    });
});
