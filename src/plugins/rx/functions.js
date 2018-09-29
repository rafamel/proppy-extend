import Ajv from 'ajv';
import { compose, withObservable as ppWithObservable } from 'proppy';
import ensemble from '~/ensemble';
import { none, intercept } from '~/functions';
import config from '~/config';

const ajv = new Ajv();

function subscription(args, stream = false) {
  const getObs = args[1] || args.pop();
  const opts = typeof args[0] === 'string' ? { as: args[0] } : args[0] || {};

  const { components } = config.get('connector');
  const rx = config.get('rx');

  let options = {
    as: null,
    wait: true,
    validate: null
  };
  Object.assign(options, opts);

  const validation = options.validate && ajv.compile(options.validate);

  const proppyFn = stream ? rx.proppy.withStream : ppWithObservable;
  const { filter, map, tap } = rx.operators;
  return ensemble({ ready: false }, (state) =>
    compose(
      proppyFn((props) => {
        return getObs(props).pipe(
          filter((res) => (validation ? validation(res) : true)),
          map((res) => (options.as ? { [options.as]: res } : res)),
          tap(() => state.set('ready', true))
        );
      }),
      options.wait
        ? intercept(() => !state.get('ready'), () => components.Empty)
        : none()
    )
  );
}

export function withObservable(...args) {
  return subscription(args, false);
}

export function withStream(...args) {
  return subscription(args, true);
}
