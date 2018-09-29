import { attach } from 'proppy-react';
import viewCompose from './view-compose';
import getAttach from './getAttach';
import getIntercept from './getIntercept';

export default {
  type: 'connector',
  attach,
  viewCompose,
  components: {
    getAttach,
    getIntercept,
    Empty: () => null
  }
};
