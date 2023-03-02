import {defineStore} from "pinia";

export class UiError {
    readonly message: string

    readonly error?: any

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
