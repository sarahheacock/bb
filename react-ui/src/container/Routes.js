import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';

import Home from '../components/Home';
import About from '../components/About';
import Rooms from '../components/Rooms';
import LocalGuide from '../components/LocalGuide';
import Book from '../components/Book';
import Login from '../components/Login';
import NotFound from '../components/NotFound';

const Routes = (props) => {

  return (
    <Switch>

      <Route exact path="/" render={ () => (
        <Home
          fetchBlog={props.fetchBlog}
          data={props.data}
          admin={props.admin}
          selectEdit={props.selectEdit}
        />) }
      />
      <Route path="/about" render={ () => (
        <About
          fetchBlog={props.fetchBlog}
          data={props.data}
          admin={props.admin}
          selectEdit={props.selectEdit}
        />) }
      />

      <Route path="/rooms" render={ () => (
        <Rooms
          fetchBlog={props.fetchBlog}
          data={props.data}
          admin={props.admin}
          selectEdit={props.selectEdit}
          deleteBlog={props.deleteBlog}
          selectAdd={props.selectAdd}
        />) }
      />
      <Route path="/local-guide" render={ () => (
        <LocalGuide
          fetchBlog={props.fetchBlog}
          data={props.data}
          admin={props.admin}
          selectEdit={props.selectEdit}
          selectAdd={props.selectAdd}
          deleteBlog={props.deleteBlog}
        />) }
      />
      <Route path="/login" render={ () => (
        <Login
          errorMessage={props.errorMessage}
          admin={props.admin}
          verifyEmail={props.verifyEmail}
          logout={props.logout}
          createEmail={props.createEmail}
          modalVisible={props.modalVisible}
          makeModal={props.makeModal}
          checkoutSelected={props.checkout.selected}
        />) }
      />

      <Route path="/book-now" render={ () => (
        <Book
          data={props.data}
          fetchSearch={props.fetchSearch}
          select={props.select}
          checkout={props.checkout}
          updateCheckout={props.updateCheckout}
        />) }
      />

      <Route render={ () => (
        <NotFound

        />
      )} />

    </Switch>
  );
};

export default Routes;

Routes.propsTypes = {
  fetchBlog: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  admin: PropTypes.object.isRequired,
  select: PropTypes.object.isRequired,
  selectEdit: PropTypes.func.isRequired,
  selectAdd: PropTypes.func.isRequired,
  deleteBlog: PropTypes.func.isRequired,
  errorMessage: PropTypes.object.isRequired,
  verifyEmail: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,
  fetchSearch: PropTypes.func.isRequired,
  updateCheckout: PropTypes.func.isRequired,
  checkout: PropTypes.object.isRequired,
  createEmail: PropTypes.func.isRequired,
  makeModal: PropTypes.func.isRequired,
  modalVisible: PropTypes.object.isRequired
};
