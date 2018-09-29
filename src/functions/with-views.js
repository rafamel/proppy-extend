import { create } from 'proppy';
import instance from '../instance-extend';
import config from '../config';

// withViews('someView', (Component) => (props) => <div />, 'otherView')
export default function withViews(...getComponentArr) {
  const { views } = config.get('options');
  getComponentArr = getComponentArr.map((item) => {
    switch (typeof item) {
      case 'function':
        return item;
      case 'string':
        if (!views || !views[item])
          throw Error(`view(${item}) is not configured`);
        else return views[item];
      default:
        throw Error(`bad arguments passed to proppy-extend's view()`);
    }
  });

  const getComponent =
    getComponentArr.length > 1
      ? config.get('connector').viewCompose(...getComponentArr)
      : getComponentArr[0];

  return create({
    initialize() {
      instance.get(this).views.push(getComponent);
    }
  });
}
