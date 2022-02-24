import {BaseChannel, GroupChannel} from "sendbird";
import {chatHeaderMenuStyle, chatHeaderStyle} from '../styles/styles';
import {getGroupChannelTitle} from '../utils/channelUtils';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../reducers';
import {leaveGroupChannel} from '../sendbird-actions/channel-actions/GroupChannelActions';
import {ChannelActionKinds} from '../reducers/channelReducer';

const GroupChatHeaderComponent = (props: GroupChatHeaderProps) => {

  const { openInviteUsersDialog } = props;
  const currentChannel: BaseChannel | null = useSelector((state: RootState) => state.channelReducer.channel);
  const dispatch = useDispatch();

  const leaveCurrentChannel = async (): Promise<void> => {
    if (currentChannel) {
      await leaveGroupChannel(currentChannel as GroupChannel);
      dispatch({
        type: ChannelActionKinds.LEAVE_CHANNEL,
      });
    }
  }

  return (
    <div className={chatHeaderStyle}>
      <div>
        {getGroupChannelTitle(currentChannel as GroupChannel)}
      </div>
      <div className={chatHeaderMenuStyle}>
        <button
          onClick={openInviteUsersDialog}
        >
          ADD USERS
        </button>
        <button
          style={{ marginLeft: '12px'}}
          onClick={leaveCurrentChannel}
        >
          LEAVE
        </button>
      </div>
    </div>
  );
}

type GroupChatHeaderProps = {
  openInviteUsersDialog: () => void,
};

export default GroupChatHeaderComponent;