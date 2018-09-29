import withViews from './with-views';
import config from '~/config';

export default function intercept(test, intercept) {
  const { components } = config.get('connector');
  return withViews((Component) => {
    return components.getIntercept(Component, test, intercept);
  });
}
