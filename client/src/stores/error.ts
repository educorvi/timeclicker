import { defineStore } from 'pinia';
import type { useToastController } from 'bootstrap-vue-next';
import { useI18n } from 'vue-i18n';

export class UiError {
    readonly message: string;

    readonly error?: any;

    constructor(message: string, error?: any) {
        this.message = message;
        this.error = error;
        if (error) {
            console.error(error);
        }
    }
}

export const useErrorStore = defineStore('error', {
    state: () => {
        return {
            errors: [] as UiError[],
            show: undefined as ReturnType<typeof useToastController>['show'],
            t: undefined as ReturnType<typeof useI18n>['t'] | undefined,
        };
    },
    actions: {
        setError(uiError: UiError) {
            this.errors.push(uiError);
            if (!this.show) {
                console.log('No toast service available');
            }
            this.show?.({
                props: {
                    title: this.t?.('error') || 'Error',
                    body: uiError.message,
                    variant: 'danger',
                    pos: 'top-center',
                    value: 10000,
                    interval: 100,
                    progressProps: {
                        variant: 'warning',
                    },
                },
            });
        },
        removeError(e: UiError) {
            this.errors = this.errors.filter((i) => i != e);
        },
    },
    getters: {
        getAllErrors: (state) => state.errors,
    },
});
