declare type Preprocessor = (obj: object) => void;
declare type Postprocessor = (obj: object) => void;
/**
 * @internal
 */
export declare const serialize: (obj: object, preprocessor?: Preprocessor) => object;
/**
 * @internal
 */
export declare const deserialize: (obj: object, postprocessor?: Postprocessor) => object;
export {};
