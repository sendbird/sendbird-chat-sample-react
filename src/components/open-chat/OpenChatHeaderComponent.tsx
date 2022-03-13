import {BaseChannel, OpenChannel} from "sendbird";
import {chatHeaderMenuStyle, chatHeaderStyle} from '../../styles/styles';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../reducers';
import {ChannelActionKinds} from '../../reducers/channelReducer';
import {exitOpenChannel} from '../../sendbird-actions/channel-actions/OpenChannelActions';
import {OpenChannelListActionKinds} from '../../reducers/openChannelListReducer';
import {useEffect, useState} from 'react';

const OpenChatHeaderComponent = (props: OpenChatHeaderProps) => {

  const { openUpdateChannelNameDialog } = props;
  const currentChannel: BaseChannel | null = useSelector((state: RootState) => state.channelReducer.channel);
  const [channelName, setChannelName] = useState<string>('');
  const dispatch = useDispatch();

  useEffect(() => {
    if (currentChannel) {
      setChannelName(currentChannel.name);
    }
  }, [currentChannel?.name]);

  const leaveCurrentChannel = async (): Promise<void> => {
    if (currentChannel) {
      await exitOpenChannel(currentChannel as OpenChannel);
      dispatch({
        type: OpenChannelListActionKinds.DELETE_OPEN_CHANNEL,
        payload: currentChannel,
      });
      dispatch({
        type: ChannelActionKinds.LEAVE_CHANNEL,
      });
    }
  }

  return (
    <div className={chatHeaderStyle}>
      <div>
        {channelName}
      </div>
      <div className={chatHeaderMenuStyle}>
        <button
          onClick={openUpdateChannelNameDialog}
        >
          UPDATE
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

type OpenChatHeaderProps = {
  openUpdateChannelNameDialog: () => void,
};

export default OpenChatHeaderComponent;