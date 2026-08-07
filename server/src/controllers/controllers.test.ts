import { beforeEach, describe, expect, it, vi } from 'vitest';
import { db, request, resetDb } from '../test/mocks';

vi.mock('../globals', () => ({
    db,
    logger: {
        debug: vi.fn(),
        info: vi.fn(),
        warn: vi.fn(),
        error: vi.fn(),
        fatal: vi.fn(),
    },
}));

import { ActivityController } from './activityController';
import { AuthDataController } from './authDataController';
import { OrgaController } from './orgaController';
import { PingController } from './pingController';
import { StatisticsController } from './statisticsController';
import { TaskController } from './taskController';

function withStatus<T extends { setStatus: (status: number) => void }>(
    Controller: new () => T
) {
    const instance = new Controller();
    return { instance, setStatus: vi.spyOn(instance as any, 'setStatus') };
}

const task = {
    id: 'task-1',
    title: 'Documentation',
    note_mandatory: false,
    open: true,
};
const user = {
    id: 'user-a',
    name: 'Name user-a',
    email: 'user-a@example.test',
};

describe('public and task controllers', () => {
    beforeEach(resetDb);

    it('exposes configured public metadata', () => {
        expect(new AuthDataController().auth()).toEqual({
            url: 'https://keycloak.test',
            realm: 'test-realm',
            client: 'test-client',
        });
        expect(new PingController().hello()).toMatchObject({
            message: expect.stringContaining('timeclicker server'),
            version: expect.any(String),
        });
    });

    it('returns all, open, and closed tasks', async () => {
        db.getAllTasks.mockResolvedValue([task]);
        db.getOpenTasks.mockResolvedValue([task]);
        db.getClosedTasks.mockResolvedValue([{ ...task, open: false }]);
        const subject = new TaskController();

        await expect(subject.getTasks()).resolves.toEqual([task]);
        await expect(subject.getTasks('true')).resolves.toEqual([task]);
        await expect(subject.getTasks('false')).resolves.toEqual([
            { ...task, open: false },
        ]);
    });

    it('returns a task or a 404 status', async () => {
        db.getTask.mockResolvedValueOnce(task).mockResolvedValueOnce(null);
        const { instance, setStatus } = withStatus(TaskController);

        await expect(instance.getTask(task.id)).resolves.toEqual(task);
        await expect(instance.getTask('missing')).resolves.toBeNull();
        expect(setStatus).toHaveBeenCalledWith(404);
    });
});

describe('activity controller', () => {
    beforeEach(() => {
        resetDb();
        db.getUser.mockResolvedValue(user);
    });

    it('lists activities scoped to the authenticated user', async () => {
        const activities = [{ id: 'activity-1', user, task }];
        db.getActivities.mockResolvedValue(activities);
        await expect(
            new ActivityController().getActivities(request())
        ).resolves.toEqual(activities);
        expect(db.getActivities).toHaveBeenCalledWith(
            expect.objectContaining({
                where: expect.objectContaining({ user }),
                relations: { task: true, user: true },
                order: { from: 'ASC' },
            })
        );
    });

    it('creates a user from the token only on their first request', async () => {
        db.getUser.mockResolvedValueOnce(null).mockResolvedValueOnce(user);
        db.getActivities.mockResolvedValue([]);
        const subject = new ActivityController();

        await subject.getActivities(request());
        await subject.getActivities(request());
        expect(db.saveUser).toHaveBeenCalledOnce();
        expect(db.saveUser).toHaveBeenCalledWith(user);
    });

    it('creates an activity for its authenticated user', async () => {
        db.getTask.mockResolvedValue(task);
        const { instance, setStatus } = withStatus(ActivityController);
        const body = {
            taskId: task.id,
            from: new Date('2025-01-01T09:00:00Z'),
            to: new Date('2025-01-01T10:00:00Z'),
            note: 'Implemented tests',
            private_note: 'internal',
            breakMins: 0,
        };

        await instance.saveActivity(body, request());
        expect(db.saveActivity).toHaveBeenCalledWith(
            expect.objectContaining({ ...body, user, task })
        );
        expect(setStatus).toHaveBeenCalledWith(201);
    });

    it('does not save activities with an unknown task or another user activity ID', async () => {
        const { instance, setStatus } = withStatus(ActivityController);
        const body = {
            taskId: task.id,
            from: null,
            to: null,
            note: '',
            private_note: '',
            breakMins: 0,
        };
        db.getTask.mockResolvedValueOnce(null);
        await instance.saveActivity(body, request());
        expect(setStatus).toHaveBeenCalledWith(400);
        expect(db.saveActivity).not.toHaveBeenCalled();

        db.getTask.mockResolvedValue(task);
        db.getActivity.mockResolvedValue({
            id: 'activity-1',
            user: { ...user, id: 'user-b' },
            task,
        });
        await instance.saveActivity({ ...body, id: 'activity-1' }, request());
        expect(setStatus).toHaveBeenCalledWith(401);
        expect(db.saveActivity).not.toHaveBeenCalled();
    });

    it('deletes only owned activities and reports absent activities', async () => {
        db.getActivity
            .mockResolvedValueOnce({ id: 'activity-1', user, task })
            .mockResolvedValueOnce({
                id: 'activity-2',
                user: { ...user, id: 'user-b' },
                task,
            })
            .mockResolvedValueOnce(null);
        const { instance, setStatus } = withStatus(ActivityController);

        await instance.deleteActivity(request(), 'activity-1');
        await instance.deleteActivity(request(), 'activity-2');
        await instance.deleteActivity(request(), 'missing');
        expect(db.deleteActivity).toHaveBeenCalledWith(
            expect.objectContaining({ id: 'activity-1' })
        );
        expect(setStatus).toHaveBeenCalledWith(401);
        expect(setStatus).toHaveBeenCalledWith(404);
    });
});

describe('organization and statistics controllers', () => {
    beforeEach(() => {
        resetDb();
        db.getUser.mockResolvedValue(user);
    });

    it('requires the organization role', async () => {
        await expect(
            new OrgaController().getUsers(request())
        ).rejects.toMatchObject({ status: 401 });
    });

    it('returns users and redacts private organization activity notes', async () => {
        db.getUsers.mockResolvedValue([user]);
        db.getActivities.mockResolvedValue([
            { id: 'activity-1', private_note: 'private', user, task },
        ]);
        const subject = new OrgaController();

        await expect(
            subject.getUsers(request('orga-user', true))
        ).resolves.toEqual([user]);
        const activities = await subject.getAllActivities(
            request('orga-user', true)
        );
        expect(activities[0].private_note).toBe('');
    });

    it('passes user, task, and date filters to the activity query', async () => {
        db.getActivities.mockResolvedValue([]);
        const from = new Date('2025-01-01T00:00:00Z');
        const to = new Date('2025-01-31T23:59:59Z');

        await new OrgaController().getAllActivities(
            request('orga-user', true),
            ['user-a'],
            from,
            to,
            ['task-1']
        );
        expect(db.getActivities).toHaveBeenCalledWith(
            expect.objectContaining({
                where: expect.objectContaining({
                    user: expect.anything(),
                    task: expect.anything(),
                    from: expect.anything(),
                    to: expect.anything(),
                }),
            })
        );
    });

    it('returns statistics for the authenticated user', async () => {
        db.getHoursPerTask.mockResolvedValue([
            { taskId: task.id, hours: '1.5' },
        ]);
        db.getTimeHeatmap.mockResolvedValue([
            { date: '2025-01-01', totalHours: '1.5', activityCount: '1' },
        ]);
        const subject = new StatisticsController();

        await expect(subject.getHoursPerTask(request())).resolves.toEqual([
            { taskId: task.id, hours: '1.5' },
        ]);
        await expect(subject.getTimeHeatmap(request())).resolves.toEqual([
            { date: '2025-01-01', totalHours: '1.5', activityCount: '1' },
        ]);
        expect(db.getHoursPerTask).toHaveBeenCalledWith(user);
        expect(db.getTimeHeatmap).toHaveBeenCalledWith(user);
    });
});
