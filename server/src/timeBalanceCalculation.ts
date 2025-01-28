import { User, WorkingHours } from './classes';
import { db } from './globals';
import { DateTime } from 'luxon';
import { LessThan, LessThanOrEqual } from 'typeorm';
import { HoursType } from './enums';

export type WeekIdentifier = {
    week: number;
    year: number;
};

function getTimeBalanceMapKey(id: WeekIdentifier): string {
    return id.week + ' ' + id.year;
}

export type WeekTimeBalanceData = {
    week: number;
    year: number;
    startDate: Date;
    endDate: Date;
    workedHours: number;
    requiredHours: number;
    hoursPerDay: number;
    timeBalance: number;
};

export type TimeBalanceMap = Map<string, WeekTimeBalanceData>;

function getAllWeeksBetweenDates(startDate: Date, endDate: Date = new Date()): {
    map: TimeBalanceMap,
    order: WeekIdentifier[]
} {
    const weeks: TimeBalanceMap = new Map();
    const order: WeekIdentifier[] = [];
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
        const dt = DateTime.fromJSDate(currentDate);
        if (!dt.isValid) {
            throw new Error('Invalid date');
        }
        const week = dt.weekNumber;
        const year = dt.weekYear;
        const startDate = DateTime.fromObject({ weekNumber: week, weekYear: year }).toJSDate();
        const endDate = DateTime.fromObject({ weekNumber: week, weekYear: year }).plus({ weeks: 1 }).toJSDate();
        const data: WeekTimeBalanceData = {
            week,
            year,
            startDate,
            endDate,
            workedHours: 0,
            requiredHours: 0,
            hoursPerDay: 0,
            timeBalance: 0,
        };

        const id = { week, year };
        order.push(id);
        weeks.set(getTimeBalanceMapKey(id), data);

        currentDate.setDate(currentDate.getDate() + 7);
    }
    return { map: weeks, order };
}

async function setRequiredHours(weeks: TimeBalanceMap, user: User) {
    for (const [_, week] of weeks) {
        const contracts = await db.getContractData({
            where: [
                { user, startYear: week.year, startMonth: LessThanOrEqual(week.endDate.getMonth() + 1) },
                { user, startYear: LessThan(week.endDate.getFullYear()) },
            ],
            order: { startYear: 'DESC', startMonth: 'DESC' },
        });
        const newestContract = contracts[0];
        if (newestContract) {
            let contractStartDate: Date = new Date(newestContract.startYear, newestContract.startMonth - 1);
            // If contract starts in the middle of this week, adjust weekly hours accordingly
            if (contractStartDate <= week.endDate && contractStartDate >= week.startDate) {
                const weekDuration = week.endDate.getTime() - week.startDate.getTime();
                const oldContractDuration = contractStartDate.getTime() - week.startDate.getTime();
                const newContractDuration = week.endDate.getTime() - contractStartDate.getTime();

                week.requiredHours = (oldContractDuration / weekDuration) * (contracts[1]?.hoursPerWeek || 0) + (newContractDuration / weekDuration) * newestContract.hoursPerWeek;
                week.requiredHours = Math.round(week.requiredHours * 100) / 100;
                week.hoursPerDay = week.requiredHours / newestContract.daysPerWeek;
            } else {
                week.requiredHours = newestContract.hoursPerWeek;
                week.hoursPerDay = newestContract.hoursPerWeek / newestContract.daysPerWeek;
            }
        } else {
            week.requiredHours = 0;
            week.hoursPerDay = 0;
        }
    }
}

async function setWorkedHours(weeks: TimeBalanceMap, hours: WorkingHours[]) {
    for (const hour of hours) {
        const dt = DateTime.fromJSDate(hour.date);
        if (!dt.isValid) {
            throw new Error('Invalid date');
        }
        const week = dt.weekNumber;
        const year = dt.year;
        const weekData = weeks.get(getTimeBalanceMapKey({ week, year }));
        if (!weekData) {
            // Week is not in the saldo range, i.e. vacation in the future
            continue;
        }

        let duration = hour.duration / 60;
        if (hour.type === HoursType.VACATION || hour.type === HoursType.HOLIDAY || hour.type === HoursType.SICK) {
            duration = weekData.hoursPerDay;
        }

        weekData.workedHours += duration;
    }
}

function setTimeBalance(weeks: WeekTimeBalanceData[]) {
    for (let i = 0; i < weeks.length; i++) {
        weeks[i].timeBalance = (weeks[i - 1]?.timeBalance || 0) + weeks[i].workedHours - weeks[i].requiredHours;
    }
}

function roundValues(weeks: WeekTimeBalanceData[]) {
    weeks.forEach((week) => {
        week.timeBalance = Math.round(week.timeBalance * 100) / 100;
        week.workedHours = Math.round(week.workedHours * 100) / 100;
    });
}

function filterResults(weeks: WeekTimeBalanceData[], displayFrom?: Date, displayTo?: Date) {
    return weeks.filter((week) => {
        let include = true;
        if (displayFrom) {
            include = include && week.endDate >= displayFrom;
        }
        if (displayTo) {
            include = include && week.startDate <= displayTo;
        }
        return include;
    });

}


export async function calculateTimeBalance(user: User, displayFrom?: Date, displayTo?: Date): Promise<WeekTimeBalanceData[]> {
    const contracts = await db.getContractData({ where: { user }, order: { startYear: 'ASC', startMonth: 'ASC' } });
    const hours = await db.getHours({ where: { user }, order: { date: 'ASC' } });

    const firstContractStartDate = contracts.length > 0 ? new Date(contracts[0].startYear, contracts[0].startMonth - 1) : new Date();
    const firstHoursDate = hours.length > 0 ? hours[0].date : new Date();

    let startDate;

    if (firstContractStartDate > firstHoursDate) {
        startDate = firstHoursDate;
    } else {
        startDate = firstContractStartDate;
    }

    const { map, order } = getAllWeeksBetweenDates(startDate);
    await setRequiredHours(map, user);
    await setWorkedHours(map, hours);
    const orderedWeeks = order.map((id) => {
        const week = map.get(getTimeBalanceMapKey(id));
        if (!week) {
            throw new Error('Week got lost: ' + id.week + ' ' + id.year);
        }
        return week;
    });

    setTimeBalance(orderedWeeks);
    roundValues(orderedWeeks);
    filterResults(orderedWeeks, displayFrom, displayTo);

    return orderedWeeks;
}

export async function calculateAllTimeBalances(displayFrom?: Date, displayTo?: Date): Promise<Record<string, WeekTimeBalanceData[]>> {
    const users = await db.getUsers();
    const result: Record<string, WeekTimeBalanceData[]> = {};
    for (const user of users) {
        result[user.id] = await calculateTimeBalance(user, displayFrom, displayTo);
    }
    return result;
}