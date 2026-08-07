import { afterEach, vi } from 'vitest';
import { config, enableAutoUnmount } from '@vue/test-utils';

enableAutoUnmount(afterEach);

config.global.renderStubDefaultSlot = true;

class ResizeObserverMock implements ResizeObserver {
    disconnect = vi.fn();
    observe = vi.fn();
    unobserve = vi.fn();
}

vi.stubGlobal('ResizeObserver', ResizeObserverMock);

afterEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    vi.useRealTimers();
});
