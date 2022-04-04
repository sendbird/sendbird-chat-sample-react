export declare type CursorIterator = (cursor: Cursor) => Promise<void>;
export declare type CursorComplete = () => Promise<void> | void;
export declare enum CursorDirection {
    FORWARD = 0,
    BACKWARD = 1
}
export declare type CursorValueMap = (value: unknown) => unknown;
interface CursorParams {
    initialPrevValue?: unknown;
    initialNextValue?: unknown;
    iterator: CursorIterator;
    map?: CursorValueMap;
    backward?: () => Promise<unknown>;
    forward?: () => Promise<unknown>;
    complete?: CursorComplete;
}
export default class Cursor {
    private _prevValue;
    private _nextValue;
    private _map;
    private _error;
    private _backward;
    private _forward;
    private _iterator;
    private _complete;
    constructor({ initialPrevValue, initialNextValue, iterator, map, backward, forward, complete, }: CursorParams);
    get prevValue(): unknown;
    get nextValue(): unknown;
    get error(): Error;
    get hasPrevious(): boolean;
    get hasNext(): boolean;
    prev(): Promise<void>;
    next(): Promise<void>;
    stop(): void;
}
export {};
