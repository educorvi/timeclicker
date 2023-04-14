import { defineStore } from 'pinia';

export enum Breakpoint {
    xs,
    s,
    m,
    l,
    xl,
    xxl,
}

function getBreakpointForWidth(width: number): Breakpoint {
    if (width < 576) return Breakpoint.xs;
    if (width >= 576 && width < 768) return Breakpoint.s;
    if (width >= 768 && width < 992) return Breakpoint.m;
    if (width >= 992 && width < 1200) return Breakpoint.l;
    if (width >= 1200 && width < 1400) return Breakpoint.xl;
    else return Breakpoint.xxl;
}

export const useBreakpointStore = defineStore('breakpoints', {
    state: () => {
        return {
            width: window.innerWidth,
            currentBP: getBreakpointForWidth(window.innerWidth),
        };
    },
    actions: {
        setWidth(width: number) {
            this.width = width;
            this.currentBP = getBreakpointForWidth(width);
        },
    },
});
