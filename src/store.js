import { createStore } from 'redux';

const INITIAL_STATE = {
  isLoggedIn: false,
  isHelpr: undefined,
  userId: undefined,
  orderDialogOpen: false,
  helprToHire: undefined,
};

let reducer = (state, action) => {
  if (action.type === 'login-success' || action.type === 'signup-success') {
    return { ...state, isLoggedIn: 'true' };
  }

  if (action.type === 'userId') {
    return { ...state, userId: action.payload };
  }

  if (action.type === 'isHelpr') {
    return { ...state, isHelpr: action.payload };
  }

  if (action.type === 'helprToHire') {
    return { ...state, helprToHire: action.payload };
  }

  if (action.type === 'toggleOrderDialog') {
    if (state.orderDialogOpen) return { ...state, orderDialogOpen: false };
    if (!state.orderDialogOpen) return { ...state, orderDialogOpen: true };
  }

  if (action.type === 'logout') {
    return INITIAL_STATE;
  }

  return state;
};

const store = createStore(
  reducer,
  INITIAL_STATE,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default store;
