import { describe, expect, it, vi } from 'vitest';
import { ValidateError } from 'tsoa';
import { UnauthorizedError } from './authentication';
import { errorHandler } from './errorHandler';

function response() {
    const json = vi.fn();
    const status = vi.fn().mockReturnValue({ json });
    return { status, json };
}

describe('errorHandler', () => {
    it('serializes validation errors as 422 responses', () => {
        const res = response();
        errorHandler(
            new ValidateError(
                { field: { message: 'invalid', value: 'x' } },
                'Invalid'
            ),
            { path: '/api/tasks' } as any,
            res as any,
            vi.fn()
        );
        expect(res.status).toHaveBeenCalledWith(422);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({ message: 'Validation Failed' })
        );
    });

    it('serializes authorization failures and hides unexpected errors', () => {
        const unauthorized = response();
        errorHandler(
            new UnauthorizedError('Token has expired'),
            {} as any,
            unauthorized as any,
            vi.fn()
        );
        expect(unauthorized.status).toHaveBeenCalledWith(401);
        expect(unauthorized.json).toHaveBeenCalledWith({
            message: 'Unauthorized',
            details: 'Token has expired',
        });

        const unexpected = response();
        errorHandler(
            new Error('database password'),
            {} as any,
            unexpected as any,
            vi.fn()
        );
        expect(unexpected.status).toHaveBeenCalledWith(500);
        expect(unexpected.json).toHaveBeenCalledWith({
            message: 'Internal Server Error',
        });
    });
});
