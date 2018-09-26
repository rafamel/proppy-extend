import Ajv from 'ajv';
import ensemble from '../ensemble';
import { none, intercept } from './functions';
import { compose, withObservable as ppWithObservable } from 'proppy';
import config from '../config';

const ajv = new Ajv();

function subscription(getObs, opts, stream = false) {
  const { connector, rx } = config.get();
  if (!rx) throw Error('proppy-extend is not configured to use RxJS');

  let options = {
    as: null,
    wait: true,
    validate: false
  };
  if (opts) Object.assign(options, opts);

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
        ? intercept(() => !state.get('ready'), () => connector.components.Empty)
        : none()
    )
  );
}

export function withObservable(getObs, opts) {
  return subscription(getObs, opts, false);
}

export function withStream(getObs, opts) {
  return subscription(getObs, opts, true);
}
