import { create } from 'proppy';

export default function withProps(...args) {
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
    initialize:
      typeof defaults !== 'function'
        ? function() {
            setter(this, defaults);
          }
        : function() {
            setter(this, defaults(this.props, this.providers));
          },
    handleReceivedProps:
      typeof defaults !== 'function' || !options.onChange
        ? function(parentProps) {
            return this.set({ ...parentProps, ...this._last }, true);
          }
        : function(parentProps) {
            const obj = {
              ...parentProps,
              ...defaults(parentProps, this.providers)
            };
            this.set(obj, true);
          }
  });
}
