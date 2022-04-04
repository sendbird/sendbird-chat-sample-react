import User from '../user';
export default class UserEventHandler {
    onFriendsDiscovered: (users: User[]) => void;
    onTotalUnreadMessageCountUpdated: (totalCount: number, countByCustomType: object) => void;
}
