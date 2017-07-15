import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { blogID, initialEdit, initialMessage, initialCheckout } from '../data/options';

const EditButton = (props) => {
  //=====STYLE OF BUTTON DEPENDING ON BUTTON TITLE====================================================
  const style = (props.title === "Edit") ?
    "info":
    ((props.title === "Add" || "Continue" || "Select Room") ?
      "primary":
      ((props.title === "Delete") ?
        "danger":
        "default"));


  //=====WHAT THE BUTTON WILL EDIT==========================================

  //NEED if launching modal
  let modalTitle = '';
  let url = '';
  let next = ''; //determines where we are going if database edit successful
  let dataObj = {};

  //DO NOT NEED
  let checkout = {};
  let message = initialMessage;


  if(props.pageSection === "login"){
    next = "/welcome";
    modalTitle = props.title; //Login
  }
  else if (props.pageSection === "welcome"){
    //NEED TO ADD!
  }
  //====ADMIN PAGE EDITING==============
  //dataObj will be the selected data point
  else if(!(!props.user.token) &&
  (props.pageSection === "home" || props.pageSection === "about" || props.pageSection === "rooms"|| props.pageSection === "localGuide")){

    let result = {};
    Object.keys(props.dataObj).forEach((key) => {
      if(props.title === "Add" && key !== "_id") result[key] = '';
      else if((props.title === "Delete" || props.title === "Cancel Reservation") && key !== "_id") ;
      else result[key] = props.dataObj[key];
    });
    dataObj = Object.assign({}, result);
    next = '#';
    modalTitle = `${props.title} Content`;

    //if the editting is for admin page
    //if trying to delete last room or local, send error
    if(props.title === "Delete" && props.length < 2) message.error = "You cannot delete all entries. Deleting all entries will cause errors";

    if(props.title === "Delete" && props.user.token) url = `/api/admin/${blogID}/page/${props.pageSection}/${props.dataObj._id}?token=${props.user.token}`;
    else if(props.title === "Add" && props.user.token) url = `/api/admin/${blogID}/page/${props.pageSection}?token=${props.user.token}`;
    else if(props.title === "Edit" && props.user.token) url = `/api/admin/${blogID}/page/${props.pageSection}/${props.dataObj._id}`;
  }

  //======BOOKING PAGE-SECTIONS===========
  //dataObj will always be the current checkout
  else if(props.pageSection === "availability"){
    //checkout.selected is the only prop that is not directly linked to user info
    //so we have to update by hand in availability
    next="/book-now/billing";
    checkout = Object.assign({}, props.dataObj);
    //if NOT logged in, go to login modal to initialize checkout
    if(!props.user.username) modalTitle="Login";
    else if(props.user.admin) next="/book-now/confirmation";
  }

  else if(props.pageSection === "billing"){
    next = "/book-now/payment";
    if(props.user.token) url=`/locked/user/${props.user.id}?token=${props.user.token}`;
    //edit button for going editing billing
    if(props.title === "Edit Billing"){
      dataObj = Object.assign({}, {
        email: props.dataObj.billing.email,
        ...props.dataObj.billing.address
      });
      modalTitle = props.title; //Edit Billing
    }
    //edit button for moving to payment and launching payment edit
    else if(props.title === "Continue"){
      dataObj = Object.assign({}, {
        ...initialCheckout.payment,
        ...props.dataObj.payment
      });
      modalTitle = "Edit Payment";
    }
  }

  else if(props.pageSection === "payment"){
    next = "/book-now/confirmation";
    if(props.user.token)url=`/locked/user/${props.user.id}?token=${props.user.token}`;
    //edit button for going editing billing
    if(props.title === "Edit Payment"){
      dataObj = Object.assign({}, {
        ...initialCheckout.payment,
        ...props.dataObj.payment
      });
      modalTitle = props.title; //Edit Payment
    }
  }

  else if(props.pageSection === "confirmation"){
    //NEED TO ADD LATER!!!
  }

  //======SIGN UP / LOGIN==========
  //next and modalTitle are already determined in login and availability
  if(modalTitle === "Sign Up" || props.title === "Sign Up"){
    //next already determined
    //need url and dataObj
    dataObj = {
       email: '',
       password: '',
       "verify Password": '',
       ...initialCheckout.billing.address
    };
    url = "/page/user-setup";
  }
  else if(modalTitle === "Login"){
    dataObj = {
      username: '',
      password: '',
      admin: false
    };
    url = "/login"; //actually have to determine this later
  }


  //====THE ACTUAL BUTTON=====================================================

  let content = {
    message: message
  };
  //if we intitialize checkout, add it to content
  //should only be with availibility select button
  if(Object.keys(checkout).length < 1) content.checkout = checkout;
  //we may not need a modal between availability and billing
  //we will not need a modal between payment and confirmation
  // if(props.pageSection === "availability" && !(!(props.user.token))) content.edit = {};
  // else if(props.pageSection === "payment" && props.title === "Continue") content.edit = {};
  if(Object.keys(dataObj).length < 1) content.edit = initialEdit;
  else content.edit = {
    ...initialEdit,
    modalTitle: modalTitle,
    url: url,
    next: next,
    dataObj: dataObj
  };


  //page editing buttons are hidden
  //if we are not updating edit, then navLink to next page
  //...otherwise wait
  const button = (props.user.admin === false && (props.title === "Edit" || props.title === "Add" || props.title === "Delete")) ?
    <div></div> :
    <NavLink to={(Object.keys(dataObj).length < 1) ? next : "#"} onClick={ (e) => {
      props.updateState(content);
    }}>
      <Button bsStyle={style}>
        {props.title}
      </Button>
    </NavLink>;



  return ( button );
}


export default EditButton;

EditButton.propTypes = {
  user: PropTypes.object.isRequired,
  dataObj: PropTypes.object.isRequired,

  updateState: PropTypes.func.isRequired,

  title: PropTypes.string.isRequired,
  pageSection: PropTypes.string.isRequired,
  length: PropTypes.number.isRequired
};
