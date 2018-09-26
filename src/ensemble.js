import deep from 'lodash.clonedeep';

// ensemble({ ready: false }, (state) => compose(/* some stuff */), (self, state) => {});
export default function ensemble(initialState, proppyCb, ensembleCb) {
  if (!initialState) initialState = {};

  return function(...args) {
    const state = Object.entries(deep(initialState)).reduce(
      (acc, [key, value]) => {
        acc.set(key, value);
        return acc;
      },
      new Map()
    );

    const ans = proppyCb(state)(...args);

    if (ensembleCb) ensemble(ans, state);
    return ans;
  };
}
