import { create } from 'proppy';

export default function onInit(cb) {
  return create({
    initialize() {
      cb(this.props, this.providers);
    }
  });
}
