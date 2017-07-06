import React from 'react';
import ReactDOM from 'react-dom';
import App from './container/App';

import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk'
import axios from 'axios';

import AdminReducer from './reducers/admin';

import 'react-datepicker/dist/react-datepicker.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import './stylesheets/index.css';

import {NOW, initialData, initialPage, initialUser, initialCheckout} from './components/data/options';
//=============================================================\



  const saveState = (state) => {
    try {
      const serializedState = JSON.stringify({user: state.user, checkout: state.checkout, page: state.page});
      localStorage.setItem('info', serializedState);
    }
    catch(err){

    }
  };

  const storage = JSON.parse(localStorage.info);
  const newCheckout = (storage.checkout.selected.arrive < NOW) ?
    initialCheckout :
    storage.checkout;

  const initial = (localStorage.info !== undefined) ?
        {
          data: initialData,
          page: initialPage,
          user: initialUser,
          checkout: newCheckout
        }:
        {
          data: initialData,
          page: initialPage,
          user: initialUser,
          checkout: initialCheckout
        };

  const store = createStore(
    //AdminReducer, initial, applyMiddleware(thunk)
    AdminReducer, {
      data: initialData,
      page: initialPage,
      user: initialUser,
      checkout: initialCheckout
    }, applyMiddleware(thunk)
  );

  store.subscribe(() => {
      saveState(store.getState());
    });


  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById('root')
  );
