import Ajv from 'ajv';
import * as bjs from '@bluejay/schema';

const ajv = new Ajv();
const any = { value: true };

export default Object.entries({
  options: {
    required: ['type'],
    ...bjs.object({
      type: bjs.string({ enum: ['options'] }),
      views: bjs.object({}, { additionalProperties: true })
    })
  },
  connector: {
    minProperties: 3,
    ...bjs.object({
      type: bjs.string({ enum: ['connector'] }),
      attach: any,
      viewCompose: any,
      components: {
        minProperties: 3,
        ...bjs.object({
          getAttach: any,
          getIntercept: any,
          Empty: any
        })
      }
    })
  },
  rx: {
    minProperties: 3,
    ...bjs.object({
      type: bjs.string({ enum: ['rx'] }),
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
  mobx: {
    minProperties: 3,
    ...bjs.object({
      type: bjs.string({ enum: ['mobx'] }),
      observable: any,
      computed: any,
      reaction: any
    })
  }
}).reduce((acc, [key, value]) => {
  acc[key] = ajv.compile(value);
  return acc;
}, {});
