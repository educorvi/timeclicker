import { beforeEach, describe, expect, it, vi } from 'vitest';

const { verify } = vi.hoisted(() => ({ verify: vi.fn() }));

vi.mock('keycloak-backend', () => ({
    Keycloak: class {
        jwt = { verify };
    },
}));

import { expressAuthentication, UnauthorizedError } from './authentication';

function request(header?: string) {
    return { header: vi.fn().mockReturnValue(header) } as any;
}

describe('expressAuthentication', () => {
    beforeEach(() => verify.mockReset());

    it('rejects requests without a bearer token', async () => {
        await expect(
            expressAuthentication(request(), 'educorvi_sso')
        ).rejects.toEqual(expect.any(UnauthorizedError));
        await expect(
            expressAuthentication(request(), 'unknown')
        ).rejects.toBeUndefined();
    });

    it('rejects invalid and expired tokens', async () => {
        verify.mockRejectedValueOnce(new Error('bad signature'));
        await expect(
            expressAuthentication(request('Bearer invalid'), 'educorvi_sso')
        ).rejects.toMatchObject({ message: 'Token is not valid' });

        verify.mockResolvedValueOnce({
            isExpired: () => true,
            hasRealmRole: () => false,
        });
        await expect(
            expressAuthentication(request('Bearer expired'), 'educorvi_sso')
        ).rejects.toMatchObject({ message: 'Token has expired' });
    });

    it('stores the verified token and organization status on the request', async () => {
        const token = {
            isExpired: () => false,
            hasRealmRole: (role: string) => role === 'orga',
        };
        verify.mockResolvedValue(token);
        const req = request('Bearer valid-token');

        await expect(
            expressAuthentication(req, 'educorvi_sso')
        ).resolves.toBeNull();
        expect(verify).toHaveBeenCalledWith('valid-token');
        expect(req.authToken).toEqual({ token, isOrga: true });
    });
});
