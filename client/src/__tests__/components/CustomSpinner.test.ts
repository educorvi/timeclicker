import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import CustomSpinner from '../../components/CustomSpinner.vue';

describe('CustomSpinner Component', () => {
    it('should render correctly', () => {
        const wrapper = mount(CustomSpinner);
        expect(wrapper.exists()).toBe(true);
    });

    it('should have the correct container id', () => {
        const wrapper = mount(CustomSpinner);
        expect(wrapper.find('#customSpinner').exists()).toBe(true);
    });

    it('should render a spinner element', () => {
        const wrapper = mount(CustomSpinner);
        const spinner = wrapper.find('.text-danger');
        expect(spinner.exists()).toBe(true);
    });

    it('should have proper styling classes', () => {
        const wrapper = mount(CustomSpinner);
        const container = wrapper.find('#customSpinner');
        expect(container.exists()).toBe(true);
    });
});
