export default class Logger {
    static off(): void;
    static log(...args: any[]): void;
    static warning(...args: any[]): void;
    static error(...args: any[]): void;
}
