import { compose, create as ppCreate } from 'proppy';

function get(current) {
  if (!current) return null;
  return current[symbol] ? current[symbol] : get(current.parent);
}

function create(P) {
  return compose(
    ppCreate({
      initialize() {
        this[symbol] = {
          views: []
        };
      }
    }),
    P,
    ppCreate({
      initialize() {
        this.instance = get(this);
      },
      handleReceivedProps(props) {
        this.set({
          ...props,
          [symbol]: this.instance
        });
      }
    })
  );
}

export const symbol = '__proppy_extend__';
export default {
  get,
  create
};
