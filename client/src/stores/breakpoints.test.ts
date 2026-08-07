import { beforeEach, describe, expect, it } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';

import { Breakpoint, useBreakpointStore } from './breakpoints';

describe('breakpoint store', () => {
    beforeEach(() => {
        setActivePinia(createPinia());
    });

    it.each([
        [0, Breakpoint.xs],
        [575, Breakpoint.xs],
        [576, Breakpoint.s],
        [767, Breakpoint.s],
        [768, Breakpoint.m],
        [991, Breakpoint.m],
        [992, Breakpoint.l],
        [1199, Breakpoint.l],
        [1200, Breakpoint.xl],
        [1399, Breakpoint.xl],
        [1400, Breakpoint.xxl],
    ])('maps width %i to its breakpoint', (width, breakpoint) => {
        const store = useBreakpointStore();

        store.setWidth(width);

        expect(store.width).toBe(width);
        expect(store.currentBP).toBe(breakpoint);
    });
});
