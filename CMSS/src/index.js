import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import { routerMiddleware } from 'react-router-redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import createHistory from 'history/createHashHistory'
import thunk from 'redux-thunk'
import 'es6-promise/auto'
import 'setimmediate'
import 'chartist-plugin-tooltip'

import registerServiceWorker from 'registerServiceWorker'

import reducer from 'ducks'

import 'resources/_antd.less' // redefinition AntDesign variables
import 'bootstrap/dist/css/bootstrap.min.css' // bootstrap styles

import 'resources/AntStyles/AntDesign/antd.cleanui.scss'
import 'resources/CleanStyles/Core/core.cleanui.scss'
import 'resources/CleanStyles/Vendors/vendors.cleanui.scss'

import App from 'app.js';
// for apollo - graphql
import { ApolloProvider } from 'react-apollo';
import client from './apollo';

const history = createHistory()
const router = routerMiddleware(history)
const middlewares = [router, thunk]
const isLogger = false
if (isLogger && process.env.NODE_ENV === 'development') {
  const { logger } = require('redux-logger')
  middlewares.push(logger)
}
export const store = createStore(reducer, composeWithDevTools(applyMiddleware(...middlewares)))
ReactDOM.render(
  <Provider store={store}>
    <ApolloProvider client={client}>     
      <App />
    </ApolloProvider>
  </Provider>,
  document.getElementById('root'),
);
registerServiceWorker();

export default history;
