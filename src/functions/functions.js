import { create, withProps } from 'proppy';
import instance from '../instance-extend';
import config from '../config';

export function none() {
  return create({});
}

// view((Component) => (props) => <div />)
export function view(getComponent) {
  return create({
    initialize() {
      instance.get(this).views.push(getComponent);
    }
  });
}

// intercept((props) => true, (Component) => (props) => <div />)
export function intercept(test, intercept) {
  const { connector } = config.get();
  return view((Component) => {
    return connector.components.getIntercept(Component, test, intercept);
  });
}

export function withProviders() {
  return withProps((_, providers) => providers);
}
