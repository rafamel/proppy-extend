import Ajv from 'ajv';
import * as bjs from '@bluejay/schema';

const ENV = process.env.NODE_ENV;
const ajv = new Ajv();
const any = { value: true };

const validation = ajv.compile({
  required: ['connector'],
  ...bjs.object({
    rx: {
      minProperties: 2,
      ...bjs.object({
        proppy: any,
        operators: {
          minProperties: 3,
          ...bjs.object({
            map: any,
            filter: any,
            tap: any
          })
        }
      })
    },
    connector: {
      minProperties: 2,
      ...bjs.object({
        attach: any,
        components: {
          minProperties: 3,
          ...bjs.object({
            getAttach: any,
            getIntercept: any,
            Empty: any
          })
        }
      })
    }
  })
});

let configObj = {};
let validated = false;

function config(obj) {
  validated = false;
  return (configObj = obj);
}

config.set = function configSet(key, value) {
  validated = false;
  return (configObj[key] = value);
};

config.get = function configGet() {
  if (ENV === 'development' && !validated) {
    if (!validation(configObj)) {
      throw Error(
        `You didn't pass a valid configuration object to proppy-extend`
      );
    }
    validated = true;
  }
  return configObj;
};

export default config;
