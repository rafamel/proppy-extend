import { compose } from 'proppy';
import config from './config';
import instance from './instance-extend';

export default function attach(...args0) {
  const connector = config.get('connector');

  const P = instance.create(compose(...args0));

  return (Component, ...args1) => {
    const Attach = connector.components.getAttach(Component);
    return connector.attach(P)(Attach, ...args1);
  };
}
