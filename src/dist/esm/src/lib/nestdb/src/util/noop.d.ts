export declare const noop: () => void;
export declare const noopAsync: () => Promise<void>;
export declare const redirect: (value: unknown) => unknown;
export declare const redirectUpgrade: (_: number, next: (err: Error) => Promise<void>) => void;
