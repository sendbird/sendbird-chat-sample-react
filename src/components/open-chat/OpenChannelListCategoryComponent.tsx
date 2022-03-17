import {channelListCategoryStyle, messageButtonStyle} from '../../styles/styles';

const OpenChannelListCategoryComponent = (props: OpenChannelListCategoryProps) => {
  const {
    openCreateChannelDialog,
    openOpenChannelListDialog,
    categoryName,
  } = props;

  return (
    <div>
      <div style={{ display:'flex', justifyContent: 'flex-end', padding: '0 8px' }}>
        <div
          className={messageButtonStyle}
          style={{ color: 'green' }}
          onClick={openCreateChannelDialog}
        >
          CREATE
        </div>
        <div
          className={messageButtonStyle}
          style={{ color: 'green' }}
          onClick={openOpenChannelListDialog}
        >
          JOIN
        </div>
      </div>
      <div className={channelListCategoryStyle}>
        <p style={{ marginRight: '10px' }}>{categoryName}</p>
      </div>
    </div>
  )
}

type OpenChannelListCategoryProps = {
  openCreateChannelDialog: () => void,
  openOpenChannelListDialog: () => void,
  categoryName: string,
};

export default OpenChannelListCategoryComponent;