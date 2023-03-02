import {defineStore} from "pinia";

export const errorState = defineStore('error', {
    state: () => {
        return {
            error: false,
            message: ""
        }
    },
    actions: {
        setError(message: string) {
            this.message = message;
            this.error = true;
        },
        removeError() {
            this.error = true;
        },
    }
})
