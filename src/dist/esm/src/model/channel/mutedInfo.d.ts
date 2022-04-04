/**
 * @internal
 */
export interface MutedInfoPayload {
    'is_muted': boolean;
    'start_at'?: number;
    'end_at'?: number;
    'remaining_duration'?: number;
    'description'?: string;
}
export default interface MutedInfo {
    isMuted: boolean;
    startAt: number;
    endAt: number;
    remainingDuration: number;
    description: string;
}
