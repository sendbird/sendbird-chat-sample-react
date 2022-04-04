import BaseMessage from '../model/message/baseMessage';
import { MessageTypeFilter } from '../model/message/types';
export default class MessageFilter {
    messageTypeFilter: MessageTypeFilter;
    customTypesFilter: string[];
    senderUserIdsFilter: string[];
    clone(): MessageFilter;
    match(message: BaseMessage): boolean;
}
