# proppy-extend

[![Version](https://img.shields.io/github/package-json/v/rafamel/proppy-extend.svg)](https://github.com/rafamel/proppy-extend) <!-- [![Build Status](https://travis-ci.org/rafamel/proppy-extend.svg)](https://travis-ci.org/rafamel/proppy-extend) [![Coverage](https://img.shields.io/coveralls/rafamel/proppy-extend.svg)](https://coveralls.io/github/rafamel/proppy-extend) -->
[![Dependencies](https://david-dm.org/rafamel/proppy-extend/status.svg)](https://david-dm.org/rafamel/proppy-extend)
[![Vulnerabilities](https://snyk.io/test/npm/proppy-extend/badge.svg)](https://snyk.io/test/npm/proppy-extend)
[![Issues](https://img.shields.io/github/issues/rafamel/proppy-extend.svg)](https://github.com/rafamel/proppy-extend/issues)
[![License](https://img.shields.io/github/license/rafamel/proppy-extend.svg)](https://github.com/rafamel/proppy-extend/blob/master/LICENSE)

<!-- markdownlint-disable MD036 -->
**Proppy's missing pieces**
<!-- markdownlint-enable MD036 -->

## Install

[`npm install proppy-extend`](https://www.npmjs.com/package/proppy-extend)

It's required to have `proppy@^1.2.6` in order to use `proppy-extend`: `npm install proppy`.

## Setup

### Plugins and config

Setup must be done at the beginning of your application entry point, before other files that use `proppy-extend` are imported. It is required to at least register a connector plugin for your views framework. **For now, only the [React integration](#react) is available,** though contributions are welcomed.

`index.js`

```javascript
import 'babel-polyfill';

import './setup';

// ...other imports
```

Instead of having each plugin published as a different package, all plugins live within the `plugins` folder. Check the available plugins [here.](#plugins)

`setup.js`

```javascript
import { config } from 'proppy-extend';
import connector from 'proppy-extend/plugins/react';

config.plugin(connector);
config.options({ /* my options object */ });
```

### `attach(...middlewares)`

* `middlewares`: Proppy *function*s.

In order to use `proppy-extend` functions, you must use the provided `attach()` instead of the one provided by `proppy`'s framework-specific package.

`attach()` can also perform composition by itself, so explicit usage of `compose` (`attach(compose(...middlewares))`) is unneded.

```javascript
import React from 'react';
import { attach, intercept } from 'proppy-extend';
import { withProps } from 'proppy';

const enhance = attach(
  intercept((props) => !props.ready, () => <div>Component Not Ready</div>),
  withProps({ hello: 'world' })
);

export default enhance(MyComponent);
```

## Usage

### `ensemble(initialState, callback)`

Share state between already created single functions.

* `initialState`: *Object*.
* `callback`: *Function,* taking `state`. Use `state.get()` and `state.set()` to get or set any state property: `(state) => proppyFunction`.

```javascript
import { compose, withObservable } from 'proppy'
import { ensemble, intercept } from 'proppy-extend';

ensemble(
  { ready: false },
  (state) => compose(
    withObservable((props) => {
      return props.myObservable$.pipe(tap(() => state.set('ready', true)));
    }),
    intercept(() => !state.get('ready'), () => <div>Stream not ready!</div>)
  )
);
```

### `withViews(...callbacks)`

Manipulates the component view/render to allow for traditional component composition when needed. `withViews()` will always run last within the `proppy` flow.

* `callbacks`: Any number of component returning *function*s; or *string*s when previously registered on setup: `(Component) => ModifiedComponent`.

```javascript
import React from 'react';
import { attach, withViews } from 'proppy-extend';

const getTopComponent = (Component) => (props) => {
  <div>
    <p>This is the top component</p>
    <Component {...props} />
  </div>
};

const getInnerComponent = (Component) => (props) => {
  <div>
    <p>This is the inner component</p>
    <Component {...props} />
  </div>
};

export default attach(
  withViews(getTopComponent, getInnerComponent)
)(MyComponent);
```

`withViews` can also take a string with the view name [when previously registered via options on setup:](#setup)

`setup.js`

```javascript
import { observer } from 'mobx-react';

// ...

config.options({
  views: {
    mobx: observer,
    top: (Component) => (props) => {
      <div>
        <p>This is the top component</p>
        <Component {...props} />
      </div>
    }
  }
});
```

```javascript
import { withViews } from 'proppy-extend';

withViews('mobx', 'top');
```

### `intercept(test, callback)`

Similar to `withViews()`, but will only run if a condition is met, that is, when `test` returns truthy.

* `test`: *Function,* `(props) => true`
* `callback`: *Function,* `(Component) => ModifiedComponent`

```javascript
import { intercept } from 'proppy-extend';

intercept(
  (props) => !!props.iWantToIntercept,
  (Component) => (props) => <div>I intercepted</div>
);
```

### `withProviders()`

Merges `providers` with props.

```javascript
import { withProviders } from 'proppy-extend';

withProviders();
```

### `onInit(callback)`

Calls `callback` on initialization.

* `callback`: *Function,* `(props, providers) => { /* do stuff */ }`

```javascript
import { onInit } from 'proppy-extend';

onInit((props) => { /* do stuff */ });
```

### `none()`

Shorthand for a null function. Useful for conditional usage, particularly with `ensemble`.

```javascript
import { none } from 'proppy-extend';

none();
```

### `withProps(options?, callback)`

* `options`: *Object* or *string*, optional.
  * As an *object*, it can have keys:
    * `as`: *String,* it'll pass the observable results as a single property. Default: `null`.
    * `onChange`: *Boolean,* it will not only update when mobx observables fire, but also when parent props change. Default: `false`.
  * If as a *string*, it will serve as `options.as`.
* `callback`: *Function,* : `(props, providers) => props`

```javascript
import { attach, withProps } from 'proppy-extend';

withProps('styles', (props) => ({
  root: {
    fontFamily: props.size,
    width: '100%'
  },
  inner: {
    background: 'red'
  }
}));
```

## Plugins

### React

Requires `react@^16.5.0` and `proppy-react@^1.2.6`: `npm install react proppy-react`.

Allows you to use `proppy-extend` with react. It must be [registered on setup](#setup):

`setup.js`

```javascript
import { config } from 'proppy-extend';
import connector from 'proppy-extend/plugins/react';

config.plugin(connector);
```

### RxJS

Requires `rxjs@^6.0.0` and `proppy-rx@^1.2.6`: `npm install rxjs proppy-rx`.

It must be [registered on setup](#setup):

`setup.js`

```javascript
import { config } from 'proppy-extend';
import rx from 'proppy-extend/plugins/rx';

config.plugin(rx);
```

#### `withObservable(options?, callback)`

* `options`: *Object* or *string*, optional.
  * As an *object*, it can have keys:
    * `as`: *String,* it'll pass the observable results as a single property. Default: `null`.
    * `wait`: *Boolean,* if `true`, the component won't render until the observable has resolved. Default: `true`.
    * `validate`: *Object,* a JSON schema to validate the result agains. If failed, it will be filtered. Default: `null`.
  * If as a *string*, it will serve as `options.as`.
* `callback`: *Function,* called on initialization: `(props, providers) => props.myStream$`

```javascript
import { attach, withObservable } from 'proppy-extend';

withObservable('item', (props) => props.item$)
```

#### `withStream(options?, callback)`

Same as `withObservable()` but `callback` receives an stream of props.

* `options`: Same as `withObservable()`, optional.
* `callback`: *Function,* called on initialization, `(props$, providers) => props$`

```javascript
import { switchMap } from 'rxjs/operators';
import { attach, withStream } from 'proppy-extend';

withObservable('item', (props$) => props$.switchMap(
  (props) => props.item$
))
```

### Mobx

Requires `mobx@^5.0.0`: `npm install mobx`.

It must be [registered on setup](#setup):

`setup.js`

```javascript
import { config } from 'proppy-extend';
import mobx from 'proppy-extend/plugins/mobx';

config.plugin(mobx);
```

#### `withComputed(options?, callback)`

* `options`: *Object* or *string*, optional.
  * As an *object*, it can have keys:
    * `as`: *String,* it'll pass the observable results as a single property. Default: `null`.
    * `onChange`: *Boolean,* it will not only update when mobx observables fire, but also when parent props change. Default: `false`.
  * If as a *string*, it will serve as `options.as`.
* `callback`: *Function,* : `(props, providers) => providers.store.myObservable`

```javascript
import { attach, withComputed } from 'proppy-extend';

withComputed('styles', (_, { store }) => ({
  root: {
    fontFamily: store.theme.fontFamily,
    width: '100%'
  },
  inner: {
    background: store.theme.innerBg
  }
}));
```