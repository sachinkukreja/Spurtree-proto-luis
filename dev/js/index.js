import 'babel-polyfill';
import React from 'react';
import ReactDOM from "react-dom";
import {Provider} from 'react-redux';
import {createStore,applyMiddleware,compose} from 'redux';
import allReducers from './reducers';
import thunkMiddleware from 'redux-thunk'
import createLogger from 'redux-logger'

import App from './components/app';

const loggerMiddleware = createLogger();

const store = createStore(allReducers,compose(applyMiddleware(thunkMiddleware,loggerMiddleware),
    window.devToolsExtension ? window.devToolsExtension() : f => f));

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
);
