import validations from './validations';
const ENV = process.env.NODE_ENV;

let configObj = {
  options: {}
};

function throwInvalid() {
  throw Error("You didn't pass a valid configuration object to proppy-extend");
}

export default {
  plugin(obj) {
    if (ENV !== 'development') return (configObj[obj.type] = obj);

    // Only @ development env
    if (!obj.type) return throwInvalid();
    const validation = validations[obj.type];
    if (!validation || !validation(obj)) return throwInvalid();
    return (configObj[obj.type] = obj);
  },
  options(obj) {
    return this.plugin({ ...obj, type: 'options' });
  },
  get(key) {
    const value = configObj[key];
    if (ENV !== 'development') return value;

    if (!value) throw Error(`proppy-extend ${key} is not configured`);
    return value;
  }
};
