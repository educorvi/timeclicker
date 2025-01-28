import { User } from './classes';
import { db } from './globals';
import { HoursType } from './enums';

export type VacationDayData = {
    vacationDays: number;
    vacationDaysLeft: number;
};

async function getTotalVacationDays(user: User) {
    const contracts = await db.getContractData({
        where: { user },
        order: { startYear: 'ASC', startMonth: 'ASC' },
    });

    let vacationDays = 0;

    for (let i = 0; i < contracts.length; i++) {
        const contract = contracts[i];
        const nextContract = contracts[i + 1];
        const nextContractStartMonth = nextContract ? nextContract.startMonth : 1;
        const nextContractStartYear = nextContract ? nextContract.startYear : (new Date()).getFullYear() + 1;

        const contractDuration = (nextContractStartYear - contract.startYear) * 12 + nextContractStartMonth - contract.startMonth;

        vacationDays += contract.vacationDays * contractDuration / 12
    }

    vacationDays = Math.ceil(vacationDays);
    return vacationDays;

}

async function getUsedVacationDays(user: User) {
    const vacationDays = await db.getHours({ where: { user, type: HoursType.VACATION}, order: { date: 'ASC' } });
    return vacationDays.length;
}

export async function getVacationDayData(user: User): Promise<VacationDayData> {
    const totalVacationDays = await getTotalVacationDays(user);
    const usedVacationDays = await getUsedVacationDays(user);
    return {
        vacationDays: totalVacationDays,
        vacationDaysLeft: totalVacationDays-usedVacationDays,
    };
}

export async function getAllVacationDayData(): Promise<Record<string, VacationDayData>> {
    const users = await db.getUsers();
    const result: Record<string, VacationDayData> = {};
    for (const user of users) {
        result[user.id] = await getVacationDayData(user);
    }
    return result;
}