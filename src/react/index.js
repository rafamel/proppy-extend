import { attach } from 'proppy-react';
import getAttach from './getAttach';
import getIntercept from './getIntercept';

export default {
  attach,
  components: {
    getAttach,
    getIntercept,
    Empty: () => null
  }
};
