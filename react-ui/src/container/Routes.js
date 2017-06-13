import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';

import Home from '../components/Home';
import Authors from '../components/Authors';
import Publications from '../components/Publications';
import News from '../components/News';
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
      <Route path="/authors" render={ () => (
        <Authors
          fetchBlog={props.fetchBlog}
          data={props.data}
          admin={props.admin}
          selectEdit={props.selectEdit}
        />) }
      />

      <Route path="/news" render={ () => (
        <News
          fetchBlog={props.fetchBlog}
          data={props.data}
          admin={props.admin}
          selectEdit={props.selectEdit}
          deleteBlog={props.deleteBlog}
          selectAdd={props.selectAdd}
        />) }
      />
      <Route path="/publications" render={ () => (
        <Publications
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
        />) }
      />

      <Route render={ () => (
        <Redirect to="/" />
      )} />

    </Switch>
  );
};

export default Routes;

Routes.propsTypes = {
  fetchBlog: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  admin: PropTypes.object.isRequired,
  selectEdit: PropTypes.func.isRequired,
  selectAdd: PropTypes.func.isRequired,
  deleteBlog: PropTypes.func.isRequired,
  errorMessage: PropTypes.object.isRequired,
  verifyEmail: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,
};
