/**
 * @internal
 */
export interface InstancedObjectPayload {
    '_iid'?: string;
}
/**
 * @internal
 * HOW TO PROPAGATE INSTANCE ID (a.k.a iid):
 *  In constructor of every class which extends InstancedObject, it should use _iid to create an instanced object property.
 *  e.g. this.inviter = new User({ _iid: this._iid, ...payload['invited_by'] })
 */
export default abstract class InstancedObject {
    /**
     * @internal
     */
    readonly _iid: string;
    /**
     * @internal
     */
    constructor(_iid: string);
    /**
     * @internal
     */
    static payloadify(obj: InstancedObject): InstancedObjectPayload;
}
