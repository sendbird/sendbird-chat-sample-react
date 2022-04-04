/**
 * @internal
 */
export interface RetryStrategy {
    calcTimeout: (count: number) => number;
}
