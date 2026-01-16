import type { JSONSchema, UISchema } from '@educorvi/vue-json-form';
import { type ComposerTranslation } from 'vue-i18n';

export function getContractEntryJsonSchema(
    t: ComposerTranslation
): JSONSchema {
    return {
        type: 'object',
        properties: {
            hoursPerWeek: {
                type: 'number',
                title: t('hours_per_week'),
                description: t('hours_per_week_desc'),
                minimum: 0,
            },
            daysPerWeek: {
                type: 'number',
                title: t('days_per_week'),
                description: t('days_per_week_desc'),
                minimum: 0,
            },
            vacationDays: {
                type: 'number',
                title: t('vacation_days'),
                description: t('vacation_days_desc'),
                minimum: 0,
            },
            startMonth: {
                type: 'string',
                title: t('start_month'),
                description: t('start_month_desc'),
                enum: [
                    '1',
                    '2',
                    '3',
                    '4',
                    '5',
                    '6',
                    '7',
                    '8',
                    '9',
                    '10',
                    '11',
                    '12',
                ],
            },
            startYear: {
                type: 'number',
                title: t('start_year'),
                description: t('start_year_desc'),
                minimum: 1970,
            },
        },
        required: [
            'hoursPerWeek',
            'daysPerWeek',
            'vacationDays',
            'startMonth',
            'startYear',
        ],
    };
}

export function getContractEntryUiSchema(t: ComposerTranslation): UISchema {
    return {
        version: '2.0',
        layout: {
            type: 'VerticalLayout',
            elements: [
                {
                    type: 'Control',
                    scope: '/properties/hoursPerWeek',
                },
                {
                    type: 'Control',
                    scope: '/properties/daysPerWeek',
                },
                {
                    type: 'Control',
                    scope: '/properties/vacationDays',
                },
                {
                    type: 'Control',
                    scope: '/properties/startMonth',
                    options: {
                        enumTitles: {
                            '1': t('months[0]'),
                            '2': t('months[1]'),
                            '3': t('months[2]'),
                            '4': t('months[3]'),
                            '5': t('months[4]'),
                            '6': t('months[5]'),
                            '7': t('months[6]'),
                            '8': t('months[7]'),
                            '9': t('months[8]'),
                            '10': t('months[9]'),
                            '11': t('months[10]'),
                            '12': t('months[11]'),
                        },
                    },
                },
                {
                    type: 'Control',
                    scope: '/properties/startYear',
                },
                {
                    type: 'Divider',
                },
                {
                    type: 'Button',
                    buttonType: 'submit',
                    text: t('save'),
                    options: {
                        variant: 'primary',
                    },
                },
            ],
        },
    };
}
