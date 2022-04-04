/**
 * @internal
 */
export default class TimeRange {
    top: number;
    bottom: number;
    constructor({ top, bottom, }: {
        top?: number;
        bottom?: number;
    });
    includes(...tss: number[]): boolean;
    overlap(range: TimeRange): boolean;
    extends(...ts: number[]): void;
}
