import APIRequestCommand from '../../../core/command/api/apiRequestCommand';
import { ChannelType } from '../../../model/channel/types';
import { ReportCategory } from '../../../model/report';
/**
 * @internal
 */
export interface ReportChannelCommandParams {
    channelUrl: string;
    channelType: ChannelType;
    userId: string;
    category: ReportCategory;
    description: string;
}
interface ReportChannelCommandPayload {
    report_category: string;
    reporting_user_id: string;
    report_description: string;
}
/**
 * @internal
 */
export declare class ReportChannelCommand extends APIRequestCommand {
    params: ReportChannelCommandPayload;
    constructor(params: ReportChannelCommandParams);
}
/**
 * @internal
 */
export interface ReportUserCommandParams {
    channelUrl: string;
    channelType: ChannelType;
    userId: string;
    offendingUserId: string;
    category: ReportCategory;
    description: string;
}
interface ReportUserCommandPayload {
    channel_url: string;
    channel_type: string;
    report_category: string;
    reporting_user_id: string;
    report_description: string;
}
/**
 * @internal
 */
export declare class ReportUserCommand extends APIRequestCommand {
    params: ReportUserCommandPayload;
    constructor(params: ReportUserCommandParams);
}
/**
 * @internal
 */
export interface ReportMessageCommandParams {
    channelUrl: string;
    channelType: ChannelType;
    userId: string;
    offendingUserId: string;
    messageId: number;
    category: ReportCategory;
    description: string;
}
interface ReportMessageCommandPayload {
    report_category: string;
    reporting_user_id: string;
    report_description: string;
    offending_user_id: string;
}
/**
 * @internal
 */
export declare class ReportMessageCommand extends APIRequestCommand {
    params: ReportMessageCommandPayload;
    constructor(params: ReportMessageCommandParams);
}
export {};
