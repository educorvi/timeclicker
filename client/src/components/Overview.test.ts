import { defineComponent } from 'vue';
import { createPinia } from 'pinia';
import { flushPromises, mount } from '@vue/test-utils';
import axios from 'axios';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import i18n from '@/i18n';
import { getHumanizedDuration } from '@/Commons';
import Overview from './Overview.vue';

const TableOverview = defineComponent({
    name: 'TableOverview',
    props: ['activities', 'askToDeleteActivity', 'editActivity'],
    template: '<div data-test="table-overview" />',
});

const CardOverview = defineComponent({
    name: 'CardOverview',
    props: ['activities', 'askToDeleteActivity', 'editActivity'],
    template: '<div data-test="card-overview" />',
});

const BModal = defineComponent({
    name: 'BModal',
    emits: ['ok'],
    methods: { show: vi.fn() },
    template: '<div><slot /></div>',
});

const activities = [
    {
        id: 'activity-1',
        from: '2026-08-07T09:00:00.000Z',
        to: '2026-08-07T17:00:00.000Z',
        breakMins: 30,
        note: '',
        private_note: '',
        task: { id: 'task-open', title: 'Open task' },
    },
];

function mountOverview() {
    return mount(Overview, {
        props: {
            tasks: [
                {
                    id: 'task-open',
                    title: 'Open task',
                    note_mandatory: false,
                    open: true,
                    activities: [],
                },
            ],
        },
        global: {
            plugins: [createPinia(), i18n],
            stubs: {
                TableOverview,
                CardOverview,
                BModal,
                CustomSpinner: { template: '<div data-test="spinner" />' },
                EntryEditor: { template: '<div data-test="editor" />' },
                BContainer: { template: '<div><slot /></div>' },
                BFormSelect: defineComponent({
                    props: ['modelValue'],
                    emits: ['update:modelValue'],
                    template: '<select />',
                }),
                BInputGroup: { template: '<div><slot /></div>' },
            },
        },
    });
}

describe('Overview', () => {
    beforeEach(() => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date('2026-08-07T12:00:00Z'));
        Object.defineProperty(window, 'innerWidth', {
            configurable: true,
            value: 1024,
        });
        vi.spyOn(axios, 'get').mockResolvedValue({ data: activities });
        vi.spyOn(axios, 'delete').mockResolvedValue({ data: {} });
    });

    it('loads the current month and displays the net total', async () => {
        const wrapper = mountOverview();

        await flushPromises();

        expect(axios.get).toHaveBeenCalledWith('/api/activities', {
            params: {
                from: new Date(2026, 7, 1).toISOString(),
                to: new Date(2026, 8, 0, 23, 59, 59, 999).toISOString(),
            },
        });
        expect(wrapper.text()).toContain(
            getHumanizedDuration(7.5 * 60 * 60_000)
        );
        expect(wrapper.find('[data-test="spinner"]').exists()).toBe(false);
        expect(wrapper.find('[data-test="table-overview"]').exists()).toBe(
            true
        );
    });

    it('shows the empty state after an empty response', async () => {
        vi.mocked(axios.get).mockResolvedValueOnce({ data: [] });

        const wrapper = mountOverview();
        await flushPromises();

        const table = wrapper.getComponent(TableOverview);
        expect(table.props('activities')).toEqual([]);
    });

    it('uses cards below the 768px responsive boundary', async () => {
        Object.defineProperty(window, 'innerWidth', {
            configurable: true,
            value: 767,
        });

        const wrapper = mountOverview();
        await flushPromises();

        expect(wrapper.find('[data-test="card-overview"]').exists()).toBe(true);
        expect(wrapper.find('[data-test="table-overview"]').exists()).toBe(
            false
        );
    });

    it('shows a recoverable loaded state when loading fails', async () => {
        vi.mocked(axios.get).mockRejectedValueOnce(new Error('network error'));
        const consoleError = vi
            .spyOn(console, 'error')
            .mockImplementation(() => undefined);

        const wrapper = mountOverview();
        await flushPromises();

        expect(wrapper.find('[data-test="spinner"]').exists()).toBe(false);
        expect(wrapper.getComponent(TableOverview).props('activities')).toEqual(
            []
        );
        expect(consoleError).toHaveBeenCalled();
    });

    it('deletes the selected activity and refreshes the list', async () => {
        const wrapper = mountOverview();
        await flushPromises();
        const table = wrapper.getComponent(TableOverview);

        table.props('askToDeleteActivity')(table.props('activities')[0]);
        await wrapper.getComponent(BModal).vm.$emit('ok');
        await flushPromises();

        expect(axios.delete).toHaveBeenCalledWith('/api/activities/activity-1');
        expect(axios.get).toHaveBeenCalledTimes(2);
    });
});
