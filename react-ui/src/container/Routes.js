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
          page={props.page}
          data={props.data}
          user={props.user}
          message={props.message}
          getData={props.getData}
          putData={props.putData}
          updateState={props.updateState}
        />) }
      />

      <Route exact path="/" render={() => (
        <Redirect to="/home" />
      )}
      />

      <Route path="/about" render={ () => (
        <About
          page={props.page}
          data={props.data}
          user={props.user}
          message={props.message}
          getData={props.getData}
          putData={props.putData}
          updateState={props.updateState}
        />) }
      />

      <Route path="/rooms" render={ () => (
        <Rooms
          page={props.page}
          data={props.data}
          user={props.user}
          message={props.message}
          getData={props.getData}
          putData={props.putData}
          postData={props.postData}
          deleteData={props.deleteData}
          updateState={props.updateState}
        />) }
      />
      <Route path="/local-guide" render={ () => (
        <LocalGuide
          page={props.page}
          data={props.data}
          user={props.user}
          message={props.message}
          getData={props.getData}
          putData={props.putData}
          postData={props.postData}
          deleteData={props.deleteData}
          updateState={props.updateState}
        />) }
      />

      <Route path="/welcome" render={ () => ((props.user.username) ?
        ((props.user.admin) ?
          <WelcomeAdmin
            page={props.page}
            data={props.data}
            user={props.user}
            message={props.message}
            getData={props.getData}
            refundClient={props.refundClient}
            updateState={props.updateState}
          /> :
          <Welcome
            page={props.page}
            data={props.data}
            user={props.user}
            message={props.message}
            getData={props.getData}
            refundClient={props.refundClient}
            updateState={props.updateState}
          />) :
        <Redirect to="/login" />
      )}
      />

      <Route path="/login" render={ () => ((props.user.username) ?
        <Redirect to="/welcome" /> :
          <Login
            modalEdit={props.page.edit}
            data={props.data}
            user={props.user}
            message={props.message}
            postData={props.postData}
            updateState={props.updateState}
            roomID={props.checkout.selected.roomID}
          />

        ) }
      />

      <Route path="/book-now" render={ () => (
        <Book
          page={props.page}
          data={props.data}
          user={props.user}
          checkout={props.checkout}
          message={props.message}
          getData={props.getData}
          putData={props.putData}
          postData={props.postData}
          updateState={props.updateState}
          chargeClient={props.chargeClient}
          fetchSearch={props.fetchSearch}
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
