import { create } from 'proppy';
import config from '../../config';

export function withComputed(...args) {
  const mobx = config.get('mobx');

  const defaults = args[1] || args.pop();
  const opts = typeof args[0] === 'string' ? { as: args[0] } : args[0] || {};
  let options = {
    as: null,
    onChange: false
  };
  Object.assign(options, opts);

  const setter = (self, props) => {
    props = options.as ? { [options.as]: props } : props;
    self._last = props;
    return self.set(props);
  };

  return create({
    initialize() {
      if (options.onChange) this._props = mobx.observable.box(this.props);
      this._computed = mobx.computed(() => {
        return defaults(
          options.onchange ? this._props.get() : this.props,
          this.providers
        );
      });

      this._disposer = mobx.reaction(
        () => this._computed.get(),
        (computed) => setter(this, computed)
      );

      setter(this, this._computed.get());
    },
    handleReceivedProps(parentProps) {
      if (!options.onChange) {
        return this.set({ ...parentProps, ...this._last }, true);
      }

      this._props.set(parentProps);
      this.set({ ...parentProps, ...this._last }, true);
    },
    willDestroy() {
      this._disposer();
    }
  });
}
