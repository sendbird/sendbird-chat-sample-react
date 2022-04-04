import BaseCommand from './command/baseCommand';
/**
 * @internal
 */
export declare type EventHandler<T> = (args?: T) => void;
interface EventMap {
    [key: string]: unknown;
}
/**
 * @internal
 */
export declare class EventDispatcherContext<T extends EventMap> {
    private _container;
    readonly key: string;
    constructor({ container }: {
        container: any;
    });
    private _register;
    on<K extends keyof T>(event: K, handler: EventHandler<T[K]>): EventDispatcherContext<T>;
    once<K extends keyof T>(event: K, handler: EventHandler<T[K]>): EventDispatcherContext<T>;
    close(): void;
}
/**
 * @internal
 */
export default class EventDispatcher<T extends EventMap> {
    private _container;
    on<K extends keyof T>(event: K, handler: EventHandler<T[K]>): EventDispatcherContext<T>;
    once<K extends keyof T>(event: K, handler: EventHandler<T[K]>): EventDispatcherContext<T>;
    dispatch<K extends keyof T>(event: K, args?: T[K]): void;
}
/**
 * @internal
 */
export declare type CommandDispatcherContext = EventDispatcherContext<{
    'event': BaseCommand;
}>;
/**
 * @internal
 */
export declare class CommandDispatcher {
    private _dispatcher;
    on(handler: EventHandler<BaseCommand>): CommandDispatcherContext;
    once(handler: EventHandler<BaseCommand>): CommandDispatcherContext;
    dispatch(command: BaseCommand): void;
}
export {};
