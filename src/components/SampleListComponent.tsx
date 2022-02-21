import { Link } from 'react-router-dom';
import '../styles/styles';
import {sampleListCategoryStyle, sampleListItemStyle, sampleListStyle} from '../styles/styles';

type SampleListItemProps = {
  name: string,
  path: string,
}

const BASIC_SAMPLE_ITEM_PROPS: SampleListItemProps[] = [
  {
    name: 'Group Channel',
    path: 'basic-samples/group-channel',
  },
  {
    name: 'Open Channel',
    path: '/basic-samples/open-channel',
  },
];

const SampleListItemComponent = (props: SampleListItemProps) => {
  const { name } = props;

  return (
    <div className={sampleListItemStyle}>
      <p>{ name }</p>
    </div>
  );
};

const SampleListComponent = () => {
  return (
    <div className={sampleListStyle}>
      <div className={sampleListCategoryStyle}>
        Basic Samples
      </div>
      {
        BASIC_SAMPLE_ITEM_PROPS.map((sampleListItemProps: SampleListItemProps, index) => {
          return (
            <Link to={ sampleListItemProps.path } key={ index }>
              <SampleListItemComponent { ...sampleListItemProps }/>
            </Link>
          );
        })
      }
    </div>
  );
};

type SampleListComponentProps = {};

export default SampleListComponent;