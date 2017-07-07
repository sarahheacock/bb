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



// <Route path="/home" render={ () => (
//   ) }
// />
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
          deleteData={props.deleteData}
          updateState={props.updateState}
          modalDelete={props.page.modalVisible.delete}
          //selectAdd={props.selectAdd}
        />) }
      />
      <Route path="/local-guide" render={ () => (
        <LocalGuide
          data={props.data}
          user={props.user}
          getData={props.getData}
          deleteData={props.deleteData}
          updateState={props.updateState}
          modalDelete={props.page.modalVisible.delete}
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
          page={props.page}
          data={props.data}
          user={props.user}
          message={props.message}
          postData={props.postData}
          updateState={props.updateState}
        />
        ) }
      />

      <Route path="/book-now" render={ () => (
        <Book
          data={props.data}
          fetchSearch={props.fetchSearch}
          select={props.select}
          checkout={props.checkout}
          updateCheckout={props.updateCheckout}
          admin={props.admin}
          makeModal={props.makeModal}
          modalVisible={props.modalVisible}
          verifyEmail={props.verifyEmail}
          logout={props.logout}
          createEmail={props.createEmail}
          errorMessage={props.errorMessage}
          fetchClient={props.fetchClient}
          updateEmail={props.updateEmail}
          verifyPayment={props.verifyPayment}
          chargeClient={props.chargeClient}
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
  // fetchBlog: PropTypes.func.isRequired,
  // data: PropTypes.object.isRequired,
  // admin: PropTypes.object.isRequired,
  // select: PropTypes.object.isRequired,
  // selectEdit: PropTypes.func.isRequired,
  // selectAdd: PropTypes.func.isRequired,
  // deleteBlog: PropTypes.func.isRequired,
  // errorMessage: PropTypes.object.isRequired,
  // verifyEmail: PropTypes.func.isRequired,
  // logout: PropTypes.func.isRequired,
  // fetchSearch: PropTypes.func.isRequired,
  // updateCheckout: PropTypes.func.isRequired,
  // checkout: PropTypes.object.isRequired,
  // createEmail: PropTypes.func.isRequired,
  // makeModal: PropTypes.func.isRequired,
  // modalVisible: PropTypes.object.isRequired,
  // fetchClient: PropTypes.func.isRequired,
  // updateEmail: PropTypes.func.isRequired,
  // verifyPayment: PropTypes.func.isRequired,
  // chargeClient: PropTypes.func.isRequired,
};
