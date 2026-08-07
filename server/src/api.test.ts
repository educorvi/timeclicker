import { EventEmitter } from 'node:events';
import { createRequest, createResponse } from 'node-mocks-http';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { db, resetDb } from './test/mocks';

vi.mock('./globals', () => ({
    db,
    logger: {
        debug: vi.fn(),
        info: vi.fn(),
        warn: vi.fn(),
        error: vi.fn(),
        fatal: vi.fn(),
    },
}));

vi.mock('./authentication', () => {
    class UnauthorizedError extends Error {
        readonly status = 401;
    }

    return {
        UnauthorizedError,
        expressAuthentication: async (request: any, securityName: string) => {
            if (
                securityName !== 'educorvi_sso' ||
                !request.header('Authorization')
            ) {
                throw new UnauthorizedError('No Authentication Header present');
            }
            request.authToken = {
                isOrga: false,
                token: {
                    content: {
                        sub: 'user-a',
                        name: 'Name user-a',
                        email: 'user-a@example.test',
                    },
                },
            };
        },
    };
});

import { createApp } from './app';

const user = {
    id: 'user-a',
    name: 'Name user-a',
    email: 'user-a@example.test',
};
const task = {
    id: 'task-1',
    title: 'Documentation',
    note_mandatory: false,
    open: true,
};
async function api(
    url: string,
    options: {
        method?: string;
        headers?: Record<string, string>;
        body?: unknown;
    } = {}
) {
    const request = createRequest({
        method: options.method ?? 'GET',
        url,
        headers: options.headers,
        body: options.body,
    } as any);
    const response = createResponse({ eventEmitter: EventEmitter });
    (createApp() as any).handle(request, response);
    await new Promise<void>((resolve) => response.once('end', resolve));
    return response;
}

beforeEach(async () => {
    resetDb();
    db.getUser.mockResolvedValue(user);
    db.getTask.mockResolvedValue(task);
    db.getActivities.mockResolvedValue([]);
});

describe('generated API routes', () => {
    it('rejects secured routes without an authorization header', async () => {
        const response = await api('/api/tasks');
        expect(response.statusCode).toBe(401);
        expect(response._getJSONData()).toEqual({
            message: 'Unauthorized',
            details: 'No Authentication Header present',
        });
    });

    it('returns TSOA validation errors for invalid queries and missing required activity data', async () => {
        const invalidQuery = await api('/api/tasks?open=invalid', {
            headers: { Authorization: 'Bearer test' },
        });
        expect(invalidQuery.statusCode).toBe(422);
        expect(invalidQuery._getJSONData()).toMatchObject({
            message: 'Validation Failed',
        });

        const invalidBody = await api('/api/activities', {
            method: 'POST',
            headers: {
                Authorization: 'Bearer test',
                'Content-Type': 'application/json',
            },
            body: { taskId: task.id },
        });
        expect(invalidBody.statusCode).toBe(422);
        expect(db.saveActivity).not.toHaveBeenCalled();
    });

    it('removes unrecognized and client-owned relationship fields before saving an activity', async () => {
        const response = await api('/api/activities', {
            method: 'POST',
            headers: {
                Authorization: 'Bearer test',
                'Content-Type': 'application/json',
            },
            body: {
                taskId: task.id,
                from: '2025-01-01T09:00:00Z',
                to: '2025-01-01T10:00:00Z',
                note: 'Documented',
                private_note: 'private',
                breakMins: 0,
                user: { id: 'user-b' },
                task: { id: 'other-task' },
                unexpected: 'discard me',
            },
        });

        expect(response.statusCode).toBe(201);
        expect(db.saveActivity).toHaveBeenCalledWith(
            expect.objectContaining({ user, task })
        );
        const saved = db.saveActivity.mock.calls[0][0];
        expect(saved).not.toHaveProperty('unexpected');
        expect(saved.user).toEqual(user);
        expect(saved.task).toEqual(task);
    });

    it('serves the generated OpenAPI document', async () => {
        const response = await api('/api/swagger.json');
        expect(response.statusCode).toBe(200);
        expect(response._getData()).toMatchObject({
            openapi: expect.any(String),
            paths: expect.any(Object),
        });
    });
});
