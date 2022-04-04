import { FileCompat } from '../../types';
export declare class UserUpdateParamsProperties {
    profileImage?: FileCompat;
    profileUrl?: string;
    nickname?: string;
}
export default class UserUpdateParams extends UserUpdateParamsProperties {
    constructor(props?: UserUpdateParamsProperties);
    validate(): boolean;
}
