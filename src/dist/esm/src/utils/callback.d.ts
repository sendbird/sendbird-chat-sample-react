/**
 * @internal
 * runAsCallback() runs a callback from outside.
 * if it has an error thrown, it marks the error to rethrow
 * so it'd throw the error in the customer's context eventually.
 */
export declare const runAsCallback: (callback: () => Promise<void>) => Promise<void>;
/**
 * @internal
 * runOrNothing() runs a callback.
 * if it has an error thrown, it ignores.
 */
export declare const runOrNothing: (callback: () => Promise<void>) => Promise<void>;
