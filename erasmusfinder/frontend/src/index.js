import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import 'bootstrap/dist/css/bootstrap.css';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
//import { thunk } from 'redux-thunk';

import { reducers } from './reducers';

const store = configureStore({
  reducer: reducers, 
  //middleware: [thunk],
});
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
  <React.StrictMode>
  <Provider store={store}>
    <App />
  </Provider>,
  </React.StrictMode>
  </BrowserRouter>,
);


