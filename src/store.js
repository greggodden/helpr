import { createStore } from 'redux';

let reducer = (state, action) => {
  if (action.type === 'login-success' || action.type === 'signup-success') {
    return { ...state, isLoggedIn: 'true' };
  }
  if (action.type === 'isHelpr') {
    return { ...state, isHelpr: action.payload };
  }
  if (action.type === 'logout') {
    return { isLoggedIn: false, isHelpr: undefined };
  }
  return state;
};

const store = createStore(
  reducer,
  { isLoggedIn: false, isHelpr: undefined },
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default store;
