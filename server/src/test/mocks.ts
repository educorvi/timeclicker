import { vi } from 'vitest';

export const db = {
    getUser: vi.fn(),
    getUsers: vi.fn(),
    saveUser: vi.fn(),
    getTask: vi.fn(),
    getAllTasks: vi.fn(),
    getOpenTasks: vi.fn(),
    getClosedTasks: vi.fn(),
    saveTask: vi.fn(),
    getActivities: vi.fn(),
    getActivity: vi.fn(),
    saveActivity: vi.fn(),
    deleteActivity: vi.fn(),
    getHoursPerTask: vi.fn(),
    getTimeHeatmap: vi.fn(),
};

export function request(userId = 'user-a', isOrga = false) {
    return {
        authToken: {
            isOrga,
            token: {
                content: {
                    sub: userId,
                    name: `Name ${userId}`,
                    email: `${userId}@example.test`,
                },
            },
        },
    } as any;
}

export function resetDb() {
    for (const method of Object.values(db)) method.mockReset();
}
