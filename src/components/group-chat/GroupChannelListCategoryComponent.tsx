import {
  channelListCategoryButtonContainerStyle,
  channelListCategoryStyle,
  messageButtonStyle,
  smallButtonStyle
} from '../../styles/styles';

const ChannelListCategoryComponent = (props: ChannelListCategoryProps) => {
  const {
    openDialog,
    categoryName,
  } = props;

  return (
    <div>
      <div className={channelListCategoryButtonContainerStyle}>
        <div
          className={messageButtonStyle}
          style={{ color: 'green' }}
          onClick={openDialog}
        >
          CREATE
        </div>
      </div>
      <div className={channelListCategoryStyle}>
        <p style={{ marginRight: '10px' }}>{categoryName}</p>
      </div>
    </div>
  )
}

type ChannelListCategoryProps = {
  openDialog: () => void,
  categoryName: string,
};

export default ChannelListCategoryComponent;