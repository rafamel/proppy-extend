import React from 'react';

export default function getIntercept(Component, test, intercept) {
  const Intercepted = intercept(Component);
  const InterceptComponent = (props) => {
    return test(props) ? <Intercepted {...props} /> : <Component {...props} />;
  };
  return InterceptComponent;
}
