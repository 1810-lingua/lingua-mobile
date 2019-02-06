import { createStore, combineReducers, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';
import thunkMiddleware from 'redux-thunk';

import { wordReducer } from './words';
import { languageReducer } from './language'

const reducer = combineReducers({ words: wordReducer, language: languageReducer });
const middleware = applyMiddleware(thunkMiddleware);
const store = createStore(reducer, middleware);

export default store;