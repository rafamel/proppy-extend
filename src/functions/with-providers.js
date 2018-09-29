import { withProps } from 'proppy';

export default function withProviders() {
  return withProps((_, providers) => providers);
}
