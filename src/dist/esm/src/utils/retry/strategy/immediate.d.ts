import { RetryStrategy } from '../retryStrategy';
/**
 * @internal
 */
export declare class Immediate implements RetryStrategy {
    calcTimeout(): number;
}
