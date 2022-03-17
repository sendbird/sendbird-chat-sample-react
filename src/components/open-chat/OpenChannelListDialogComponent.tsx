import React, {useEffect, useState} from 'react';
import {OpenChannel, OpenChannelListQuery} from 'sendbird';
import {
  DialogStyle, DialogButtonContainer,
  DialogItemStyle,
  DialogItemListCategoryStyle, DialogItemListStyle
} from '../../styles/styles';
import {DialogState} from '../../constants/enums';
import {
  createOpenChannelListQuery,
  enterOpenChannel,
} from '../../sendbird-actions/channel-actions/OpenChannelActions';

type OpenChannelItemProps = {
  channel: OpenChannel,
  isSelected: boolean,
  onChannelSelect: (channel: OpenChannel) => void,
};

const OpenChannelItemComponent = (props: OpenChannelItemProps) => {
  const {
    channel,
    isSelected,
    onChannelSelect,
  } = props;

  return (
    <div
      style={{ color: isSelected ? 'green' : 'black' }}
      className={DialogItemStyle}
      onClick={() => onChannelSelect(channel)}
    >
      {channel.name}
    </div>
  );
};

const OpenChannelListDialogComponent = (props: OpenChannelListDialogComponentProps) => {
  const {
    dialogState,
    closeDialog,
    enterOpenChannel,
  } = props;

  const [loading, setLoading] = useState(true);
  const [openChannelList, setOpenChannelList] = useState<OpenChannel[]>([]);
  const [channelToEnter, setChannelToEnter] = useState<OpenChannel | null>(null);
  const [openChannelListQuery, setOpenChannelListQuery] = useState<OpenChannelListQuery>(createOpenChannelListQuery());

  useEffect(() => {
    if (dialogState === DialogState.OPEN_CHANNEL_LIST) {
      openChannelListQuery.next()
        .then((channels: OpenChannel[]) => {
          setOpenChannelList(channels);
        })
        .catch((error) => alert('OpenChat getOpenChannelList error: ' + error))
        .finally(() => setLoading(false));
    }
  }, [dialogState]);

  const fetchMoreOpenChannelList = () => {
    if (openChannelListQuery.hasNext) {
      openChannelListQuery.next()
        .then((channels: OpenChannel[]) => {
          setOpenChannelList(openChannelList.concat(channels));
        })
        .catch((error) => alert('OpenChat getOpenChannelList error: ' + error));
    }
  }

  const resetAndCloseOpenChannelListDialog = () => {
    setOpenChannelListQuery(createOpenChannelListQuery());
    setOpenChannelList([]);
    setChannelToEnter(null);
    setLoading(true);
    closeDialog();
  }

  const onChannelSelect = (selectedChannel: OpenChannel) => {
    if (channelToEnter && selectedChannel.url === channelToEnter.url) {
      setChannelToEnter(null);
    } else {
      setChannelToEnter(selectedChannel);
    }
  }

  const onDialogSubmit = () => {
    if (channelToEnter) enterOpenChannel(channelToEnter);
    resetAndCloseOpenChannelListDialog();
  }

  return (
    loading
      ? null
      : <div className={DialogStyle}>
        <div className={DialogItemListCategoryStyle}>
          Open Channel List
        </div>
      <div className={DialogItemListStyle}>
        {openChannelList.map((channel: OpenChannel, i: number) => (
          <OpenChannelItemComponent
            channel={channel}
            isSelected={channelToEnter !== null && channel.url === channelToEnter.url}
            onChannelSelect={onChannelSelect}
            key={i}
          />
        ))}
      </div>
        <div className={DialogButtonContainer}>
          <button
            style={{ marginRight: '10px' }}
            onClick={onDialogSubmit}
          >
            Submit
          </button>
          <button onClick={resetAndCloseOpenChannelListDialog}>
            Close
          </button>
        </div>
      </div>
  );
}

type OpenChannelListDialogComponentProps = {
  dialogState: DialogState,
  closeDialog: () => void,
  enterOpenChannel: (channelToEnter: OpenChannel) => void,
}

export default OpenChannelListDialogComponent;