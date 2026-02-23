import type Database from './database';

export * from './classes';
export * from './controllers';
export * from './types';

export type HoursPerTask = Awaited<ReturnType<Database['getHoursPerTask']>>
export type TimeHeatmap = Awaited<ReturnType<Database['getTimeHeatmap']>>
