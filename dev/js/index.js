import 'babel-polyfill';
import React from 'react';
import ReactDOM from "react-dom";
import {Provider} from 'react-redux';
import {createStore,applyMiddleware} from 'redux';
import allReducers from './reducers';
import thunkMiddleware from 'redux-thunk'
import createLogger from 'redux-logger'

import App from './components/app';

const loggerMiddleware = createLogger();

const store = createStore(allReducers,applyMiddleware(thunkMiddleware,loggerMiddleware));

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
);
