import {defineStore} from "pinia";

export class UiError {
    readonly message: string

    readonly error?: Error

    constructor(message: string, error?: Error) {
        this.message = message;
        this.error = error;
    }


}
export const useErrorStore = defineStore('error', {
    state: () => {
        return {
            errors: [] as UiError[]
        }
    },
    actions: {
        setError(uiError: UiError) {
            this.errors.push(uiError);

        },
        removeError(e: UiError) {
            this.errors = this.errors.filter(i => i != e);
        },
    },
    getters: {
        getAllErrors: state => state.errors
    }
})
