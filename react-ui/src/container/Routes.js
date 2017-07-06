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
          //selectAdd={props.selectAdd}
        />) }
      />
      <Route path="/local-guide" render={ () => (
        <LocalGuide
          data={props.data}
          user={props.user}
          page={props.page}
          getData={props.getData}
          deleteData={props.deleteData}
          updateState={props.updateState}
          //selectAdd={props.selectAdd}
        />) }
      />

      <Route path="/welcome" render={ () => ((props.admin.username) ?
        ((props.admin.admin) ?
          <WelcomeAdmin
            admin={props.admin}
            logout={props.logout}
            fetchClient={props.fetchClient}
            data={props.data}
            refundClient={props.refundClient}
            makeModal={props.makeModal}
            modalVisible={props.modalVisible}
            errorMessage={props.errorMessage}
          /> :
          <Welcome
            admin={props.admin}
            logout={props.logout}
            fetchClient={props.fetchClient}
            data={props.data}
            refundClient={props.refundClient}
            makeModal={props.makeModal}
            modalVisible={props.modalVisible}
            errorMessage={props.errorMessage}
          />) :
        <Redirect to="/login" />
      )}
      />

      <Route path="/login" render={ () => ((props.admin.username) ?
        <Redirect to="/welcome" /> :
        <Login
          errorMessage={props.errorMessage}
          admin={props.admin}
          verifyEmail={props.verifyEmail}
          logout={props.logout}
          createEmail={props.createEmail}
          modalVisible={props.modalVisible}
          makeModal={props.makeModal}
          checkoutSelected={props.checkout.selected}
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
