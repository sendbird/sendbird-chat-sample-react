import NestDB from '../lib/nestdb/src/nest';
/**
 * @internal
 */
export declare const migrate: (nestdb: NestDB) => (oldVersion: number, next: (err?: Error) => void) => void;
