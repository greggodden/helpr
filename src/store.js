import { createStore } from 'redux';

let reducer = (state, action) => {
  return state;
};

const store = createStore(
  reducer,
  { loggedIn: false, userType: 'all' },
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default store;
