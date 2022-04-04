/**
 * @internal
 */
export declare const unless: (expr: boolean) => {
    do: (action: () => void) => void;
    throw: (err: Error) => void;
};
