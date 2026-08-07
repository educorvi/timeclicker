import { describe, expect, it, vi } from 'vitest';

import { getMonthOptions, years } from './DateUtils';

describe('date options', () => {
    it('creates translated, one-based month options', () => {
        const t = vi.fn((key: string) =>
            key.replace(/months\[(\d+)]/, 'month-$1')
        );

        expect(getMonthOptions(t).value).toEqual(
            Array.from({ length: 12 }, (_, index) => ({
                value: index + 1,
                text: `month-${index}`,
            }))
        );
        expect(t).toHaveBeenCalledTimes(12);
    });

    it('lists years from the current year down to 2022', () => {
        const currentYear = new Date().getFullYear();

        expect(years.value[0]).toBe(currentYear);
        expect(years.value[years.value.length - 1]).toBe(2022);
        expect(years.value).toHaveLength(currentYear - 2021);
    });
});
