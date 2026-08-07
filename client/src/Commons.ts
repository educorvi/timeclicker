import { language } from '@/i18n';

const formatter = new Intl.DurationFormat(language, {style: 'short'});

/**
 * Converts a duration in milliseconds into a human-readable format based on the specified units.
 *
 * @param {number} duration - The duration in milliseconds to be humanized.
 * @return {string} A human-readable string representation of the duration.
 */
export function getHumanizedDuration(
    duration: number,
): string {
    const totalMinutes = Math.floor(duration / 60_000)
    const durObj = {
        hours: Math.floor(totalMinutes / 60),
        minutes: totalMinutes % 60,
    }
    return formatter.format(durObj)
}

/**
 * Returns duration between `from` and `to` (minus `sub`, if specified)
 * @param from
 * @param to
 * @param sub
 */
export function getDurationOrDash(from: Date | null, to: Date | null, sub = 0) {
    if (!from || !to) {
        return ' - ';
    }
    return getHumanizedDuration(to.getTime() - from.getTime() - sub);
}