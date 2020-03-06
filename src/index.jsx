import ReactDOM from 'react-dom';
import './Css/mediaQueries.css';
import './Css/main.css';
import './Css/reboot.css';
import App from './App.jsx';
import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import store from './store.js';
import reloadMagic from './reload-magic-client.js'; // automatic reload
reloadMagic(); // automatic reload

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);
