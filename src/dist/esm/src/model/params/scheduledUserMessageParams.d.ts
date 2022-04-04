import { UserMessageParamsProperties } from './userMessageParams';
export interface Schedule {
    year: number;
    month: number;
    day: number;
    hour?: number;
    min?: number;
    timezone?: string;
}
export declare class ScheduledUserMessageParamsProperties extends UserMessageParamsProperties {
    year: number;
    month: number;
    day: number;
    hour?: number;
    min?: number;
    timezone?: string;
}
export default class ScheduledUserMessageParams extends ScheduledUserMessageParamsProperties {
    private _scheduledDateTimeString;
    constructor(props?: ScheduledUserMessageParamsProperties);
    get scheduledDateTimeString(): string;
    set scheduledDateTimeString(value: string);
    setSchedule(schedule: Schedule): void;
    validate(): boolean;
}
