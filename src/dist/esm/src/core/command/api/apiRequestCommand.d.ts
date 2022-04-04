import BaseCommand from '../baseCommand';
/**
 * @internal
 */
export declare enum APIRequestMethod {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    DELETE = "DELETE"
}
declare type APIRequestParams<T> = {
    [K in keyof T]: T[K];
};
/**
 * @internal
 */
export default class APIRequestCommand extends BaseCommand {
    path: string;
    method: APIRequestMethod;
    params: APIRequestParams<unknown>;
    requireAuth: boolean;
    headers: object;
    requestId: string;
    stringifyParams(val: unknown): string;
    get query(): string;
    get payload(): string | FormData;
}
export {};
