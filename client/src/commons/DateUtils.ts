import { computed } from 'vue';
import { type ComposerTranslation, useI18n } from 'vue-i18n';

export const getMonthOptions = (t: ComposerTranslation) => {
    const months = [
        t('months[0]'),
        t('months[1]'),
        t('months[2]'),
        t('months[3]'),
        t('months[4]'),
        t('months[5]'),
        t('months[6]'),
        t('months[7]'),
        t('months[8]'),
        t('months[9]'),
        t('months[10]'),
        t('months[11]'),
    ];
    return computed(() =>
        months.map((val, index) => {
            return { value: index + 1, text: val };
        })
    );
};

export const years = computed(() => {
    const currYear = new Date().getFullYear();
    const ys = [];
    for (let i = currYear; i > 2021; i--) {
        ys.push(i);
    }
    return ys;
});
