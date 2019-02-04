import { createStore, combineReducers, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';
import thunkMiddleware from 'redux-thunk';

import { wordReducer } from './words';

const reducer = combineReducers({ words: wordReducer });
// const middleware = applyMiddleware(thunkMiddleware, createLogger({ collapsed: true }));
const middleware = applyMiddleware(thunkMiddleware);
const store = createStore(reducer, middleware);

export default store;