import {channelListCategoryStyle, smallButtonStyle} from '../styles/styles';

const ChannelListCategoryComponent = (props: ChannelListCategoryProps) => {
  const {
    openDialog,
    categoryName,
  } = props;

  return (
    <div className={channelListCategoryStyle}>
      <p style={{ marginRight: '10px' }}>{categoryName}</p>
      <button
        className={smallButtonStyle}
        onClick={() => openDialog()}
      >+</button>
    </div>
  )
}

type ChannelListCategoryProps = {
  openDialog: () => void,
  categoryName: string,
};

export default ChannelListCategoryComponent;