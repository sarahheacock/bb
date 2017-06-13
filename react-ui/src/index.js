import React from 'react';
import ReactDOM from 'react-dom';
import App from './container/App';

import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk'
import axios from 'axios';

import AdminReducer from './reducers/admin';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import './stylesheets/index.css';

//import registerServiceWorker from './registerServiceWorker';


//=============================================================\
//const Render = () => {

  const data = {current: []};
  const initialState = {
    data: data,
    modalVisible: {
      add: false,
      edit: false,
      message: false
    },
    messageSent: false,
    //CHANGE BACK LATER
    admin: {admin: false, id: "a"},
    errorMessage: {},
    selectedEdit: {
      data: {},
      section: ""
    },
    selectedAdd: {
      data: {},
      section: ""
    },
    newPage: true,
  };

  const saveState = (state) => {
    try {
      const serializedState = JSON.stringify(state);
      localStorage.setItem('info', serializedState);
    }
    catch(err){

    }
  };

  const initial = (localStorage.info !== undefined) ?
        {...JSON.parse(localStorage.info), newPage: true} :
        initialState;

  const store = createStore(
    AdminReducer, initial, applyMiddleware(thunk)
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
//}

//Render();
//export default Render;
//registerServiceWorker();
