/**
 * @internal
 */
export declare const deepEqual: (origin: object, target: object) => boolean;
/**
 * @internal
 */
export declare const isTypeOf: (typeOrEnum: string | object, value: unknown, nullable?: boolean) => boolean;
/**
 * @internal
 */
export declare const isEnumOf: (Enum: object, value: unknown) => boolean;
/**
 * @internal
 */
export declare const isArrayOf: (typeOrEnum: string | object, value: unknown, nullable?: boolean) => boolean;
/**
 * @internal
 */
export declare const isResendableError: (errorCode: number) => boolean;
/**
 * @internal
 */
export declare const isFile: (obj: unknown, nullable?: boolean) => boolean;
/**
 * @internal
 */
export declare const hasSameMembers: <T>(a: T[], b: T[]) => boolean;
