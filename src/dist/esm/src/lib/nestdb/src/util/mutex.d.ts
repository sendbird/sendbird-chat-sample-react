export default class Mutex {
    readonly id: string;
    readonly key: string;
    private _locked;
    private _resolvers;
    constructor(key: string);
    get locked(): boolean;
    wait(): Promise<void>;
    lock(): Promise<void>;
    unlock(): void;
}
