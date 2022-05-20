import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

import colorSchemeReducer from './reducers/colorSchemeReducer';

const reducer = combineReducers({
  colorScheme: colorSchemeReducer,
});

const store = createStore(reducer, composeWithDevTools(applyMiddleware(thunk)));

export default store;
