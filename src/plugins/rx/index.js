import * as proppy from 'proppy-rx';
import { map, filter, tap } from 'rxjs/operators';

export default {
  type: 'rx',
  proppy,
  operators: {
    map,
    filter,
    tap
  }
};
