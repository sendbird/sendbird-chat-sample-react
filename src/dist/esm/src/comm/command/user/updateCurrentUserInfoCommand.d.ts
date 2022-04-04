import User, { UserPayload } from '../../../model/user';
import APIRequestCommand from '../../../core/command/api/apiRequestCommand';
import APIResponseCommand, { APIResponseCommandPayload } from '../../../core/command/api/apiResponseCommand';
import { FileCompat } from '../../../types';
/**
 * @internal
 */
export interface UpdateCurrentUserInfoRequestCommandParams {
    userId: string;
    nickname?: string;
    profileUrl?: string;
    profileImage?: FileCompat;
    preferredLanguages?: string[];
}
interface UpdateCurrentUserInfoRequestCommandPayload {
    nickname?: string;
    profile_url?: string;
    profile_image?: FileCompat;
    preferred_languages?: string[];
}
interface UpdateCurrentUserInfoResponseCommandPayload extends APIResponseCommandPayload, UserPayload {
}
/**
 * @internal
 */
export declare class UpdateCurrentUserInfoRequestCommand extends APIRequestCommand {
    params: UpdateCurrentUserInfoRequestCommandPayload;
    constructor({ userId, nickname, profileUrl, profileImage, preferredLanguages, }: UpdateCurrentUserInfoRequestCommandParams);
}
/**
 * @internal
 */
export declare class UpdateCurrentUserInfoResponseCommand extends APIResponseCommand {
    user: User;
    constructor(_iid: string, payload: UpdateCurrentUserInfoResponseCommandPayload);
}
export {};
