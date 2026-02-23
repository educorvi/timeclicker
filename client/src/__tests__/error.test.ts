import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useErrorStore, UiError } from '../stores/error';

describe('Error Store', () => {
    beforeEach(() => {
        // Create a fresh pinia instance for each test
        setActivePinia(createPinia());
    });

    it('should initialize with empty errors array', () => {
        const store = useErrorStore();
        expect(store.errors).toEqual([]);
        expect(store.getAllErrors).toEqual([]);
    });

    it('should add error to the errors array', () => {
        const store = useErrorStore();
        const testError = new UiError('Test error message');
        
        store.setError(testError);
        
        expect(store.errors).toHaveLength(1);
        expect(store.errors[0].message).toBe('Test error message');
    });

    it('should add multiple errors', () => {
        const store = useErrorStore();
        const error1 = new UiError('Error 1');
        const error2 = new UiError('Error 2');
        
        store.setError(error1);
        store.setError(error2);
        
        expect(store.errors).toHaveLength(2);
        expect(store.getAllErrors).toHaveLength(2);
    });

    it('should remove specific error', () => {
        const store = useErrorStore();
        const error1 = new UiError('Error 1');
        const error2 = new UiError('Error 2');
        
        store.setError(error1);
        store.setError(error2);
        
        // Find error1 from the store and remove it
        const errorToRemove = store.errors.find(e => e.message === 'Error 1');
        if (errorToRemove) {
            store.removeError(errorToRemove);
        }
        
        expect(store.errors).toHaveLength(1);
        expect(store.errors[0].message).toBe('Error 2');
    });

    it('should handle error removal when array is empty', () => {
        const store = useErrorStore();
        const error = new UiError('Test error');
        
        // Try to remove error that doesn't exist
        expect(() => store.removeError(error)).not.toThrow();
        expect(store.errors).toHaveLength(0);
    });
});

describe('UiError Class', () => {
    it('should create error with message', () => {
        const error = new UiError('Test message');
        
        expect(error.message).toBe('Test message');
        expect(error.error).toBeUndefined();
    });

    it('should create error with message and error object', () => {
        const errorObj = new Error('Original error');
        const uiError = new UiError('UI Error message', errorObj);
        
        expect(uiError.message).toBe('UI Error message');
        expect(uiError.error).toBe(errorObj);
    });
});
