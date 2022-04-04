interface Encryption {
    encrypt: (obj: object) => object;
    decrypt: (encrypted: object) => object;
}
export declare const DEFAULT_ENCRYPTION: {
    encrypt: (obj: object) => object;
    decrypt: (encrypted: object) => object;
};
export default Encryption;
