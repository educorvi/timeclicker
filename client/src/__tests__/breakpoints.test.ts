import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useBreakpointStore, Breakpoint } from '../stores/breakpoints';

describe('Breakpoint Store', () => {
    beforeEach(() => {
        // Create a fresh pinia instance for each test
        setActivePinia(createPinia());
    });

    it('should initialize with default values', () => {
        const store = useBreakpointStore();
        expect(store.width).toBeDefined();
        expect(store.currentBP).toBeDefined();
    });

    it('should update width and breakpoint when setWidth is called', () => {
        const store = useBreakpointStore();
        
        // Test xs breakpoint (< 576)
        store.setWidth(400);
        expect(store.width).toBe(400);
        expect(store.currentBP).toBe(Breakpoint.xs);

        // Test s breakpoint (576-767)
        store.setWidth(600);
        expect(store.width).toBe(600);
        expect(store.currentBP).toBe(Breakpoint.s);

        // Test m breakpoint (768-991)
        store.setWidth(800);
        expect(store.width).toBe(800);
        expect(store.currentBP).toBe(Breakpoint.m);

        // Test l breakpoint (992-1199)
        store.setWidth(1000);
        expect(store.width).toBe(1000);
        expect(store.currentBP).toBe(Breakpoint.l);

        // Test xl breakpoint (1200-1399)
        store.setWidth(1300);
        expect(store.width).toBe(1300);
        expect(store.currentBP).toBe(Breakpoint.xl);

        // Test xxl breakpoint (>= 1400)
        store.setWidth(1500);
        expect(store.width).toBe(1500);
        expect(store.currentBP).toBe(Breakpoint.xxl);
    });

    it('should correctly identify breakpoint boundaries', () => {
        const store = useBreakpointStore();
        
        // Test exact boundaries
        store.setWidth(576);
        expect(store.currentBP).toBe(Breakpoint.s);

        store.setWidth(768);
        expect(store.currentBP).toBe(Breakpoint.m);

        store.setWidth(992);
        expect(store.currentBP).toBe(Breakpoint.l);

        store.setWidth(1200);
        expect(store.currentBP).toBe(Breakpoint.xl);

        store.setWidth(1400);
        expect(store.currentBP).toBe(Breakpoint.xxl);
    });
});
