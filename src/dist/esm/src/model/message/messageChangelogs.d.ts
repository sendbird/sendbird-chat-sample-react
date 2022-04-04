import BaseMessage from './baseMessage';
export default interface MessageChangelogs {
    updatedMessages: BaseMessage[];
    deletedMessageIds: number[];
    hasMore: boolean;
    token: string;
}
