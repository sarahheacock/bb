import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';

import Home from '../components/Home';
import About from '../components/About';
import Rooms from '../components/Rooms';
import LocalGuide from '../components/LocalGuide';
import Book from '../components/Book';
import Login from '../components/Login';
import Welcome from '../components/Welcome';
import WelcomeAdmin from '../components/WelcomeAdmin';
import NotFound from '../components/NotFound';


const Routes = (props) => {

  return (
    <Switch>
      <Route path="/home" render={ () => (
        <Home
          data={props.data}
          user={props.user}

          getData={props.getData}
          updateState={props.updateState}
        />) }
      />

      <Route exact path="/" render={() => (
        <Redirect to="/home" />
      )}
      />

      <Route path="/about" render={ () => (
        <About
          data={props.data}
          user={props.user}

          getData={props.getData}
          updateState={props.updateState}
        />) }
      />

      <Route path="/rooms" render={ () => (
        <Rooms
          data={props.data}
          user={props.user}

          getData={props.getData}
          updateState={props.updateState}
        />) }
      />
      <Route path="/local-guide" render={ () => (
        <LocalGuide
          data={props.data}
          user={props.user}

          getData={props.getData}
          updateState={props.updateState}
        />) }
      />

      <Route path="/welcome" render={ () => ((props.user.username) ?
        ((props.user.admin) ?
          <WelcomeAdmin
            data={props.data}
            user={props.user}

            getData={props.getData}
            updateState={props.updateState}
          /> :
          <Welcome
            data={props.data}
            user={props.user}

            getData={props.getData}
            updateState={props.updateState}
          />) :
        <Redirect to="/login" />
      )}
      />

      <Route path="/login" render={ () => ((props.user.username) ?
        <Redirect to="/welcome" /> :
          <Login
            data={props.data}
            user={props.user}
            message={props.message}
            roomID={props.checkout.selected.roomID}

            getData={props.getData}
            postData={props.postData}
            updateState={props.updateState}
          />

        ) }
      />

      <Route path="/book-now" render={ () => (
        <Book
          data={props.data}
          user={props.user}
          checkout={props.checkout}
          checkEdit={props.checkEdit}

          getData={props.getData}
          fetchSearch={props.fetchSearch}
          chargeClient={props.chargeClient}

          updateState={props.updateState}
        />) }
      />

      <Route render={ () => (
        <NotFound />
      )} />

    </Switch>
  );
};

export default Routes;

Routes.propsTypes = {
  page: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  checkEdit: PropTypes.bool.isRequired,
  data: PropTypes.array.isRequired,
  checkout: PropTypes.object.isRequired,
  message: PropTypes.object.isRequired,
  refundClient: PropTypes.func.isRequired,
  chargeClient: PropTypes.func.isRequired,
  updateState: PropTypes.func.isRequired,
  getData: PropTypes.func.isRequired,
  putData: PropTypes.func.isRequired,
  postData: PropTypes.func.isRequired,
  deleteData: PropTypes.func.isRequired,
  fetchSearch: PropTypes.func.isRequired
};
