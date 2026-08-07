import { describe, expect, it } from 'vitest';

import { getDurationOrDash, getHumanizedDuration } from './Commons';

describe('duration helpers', () => {
    it.each([
        [0, { hours: 0, minutes: 0 }],
        [59_999, { hours: 0, minutes: 0 }],
        [60_000, { hours: 0, minutes: 1 }],
        [5_400_000, { hours: 1, minutes: 30 }],
        [90_060_000, { hours: 25, minutes: 1 }],
    ])('formats %i milliseconds using whole minutes', (duration, expected) => {
        expect(getHumanizedDuration(duration)).toBe(
            new Intl.DurationFormat().format(expected)
        );
    });

    it('returns a dash for incomplete activities', () => {
        const date = new Date('2026-08-07T09:00:00Z');

        expect(getDurationOrDash(null, date)).toBe(' - ');
        expect(getDurationOrDash(date, null)).toBe(' - ');
    });

    it('subtracts a break from a completed activity', () => {
        const from = new Date('2026-08-07T09:00:00Z');
        const to = new Date('2026-08-07T17:00:00Z');

        expect(getDurationOrDash(from, to, 30 * 60_000)).toBe(
            getHumanizedDuration(7.5 * 60 * 60_000)
        );
    });
});
