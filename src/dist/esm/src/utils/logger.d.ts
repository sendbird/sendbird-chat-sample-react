export declare enum LogLevel {
    NONE = 0,
    VERBOSE = 1,
    DEBUG = 2,
    INFO = 3,
    WARN = 4,
    ERROR = 5
}
/**
 * @internal
 */
export default class Logger {
    level: LogLevel;
    verbose(...args: any[]): void;
    debug(...args: any[]): void;
    info(...args: any[]): void;
    warn(...args: any[]): void;
    error(...args: any[]): void;
}
