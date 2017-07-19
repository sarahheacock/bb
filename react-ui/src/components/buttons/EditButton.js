import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

import { blogID, initialEdit, initialMessage, initialCheckout } from '../data/options';
var FaEmail = require('react-icons/lib/fa/envelope');

const EditButton = (props) => {
  console.log("props", props);
  //=====STYLE OF BUTTON DEPENDING ON BUTTON TITLE====================================================
  const style = (props.title === "Edit") ?
    "info":
    ((props.title === "Add" || props.title === "Continue" || props.title === "Select Room") ?
      "primary":
      ((props.title === "Delete") ?
        "danger":
        "default"));


  //=====DETERMINE NEXT AND MODAL-TITLE FROM PAGE-SECTION==========================================

  //NEED if launching modal
  let modalTitle = '';
  let url = '';
  let next = ''; //determines where we are going if database edit successful
  let dataObj = {};

  //DO NOT NEED
  //only use checkout in availability
  //only change message for delete error
  let checkout = {};
  let message = {...initialMessage};

  //props.dataObj is {}
  if(props.pageSection === ""){
    next = "#";
    if(props.title === "Login" || props.title === "Send Message") modalTitle = props.title; //Login
  }
  else if(props.pageSection === "login"){
    next = "/welcome";
    if(props.title === "Sign Up" || props.title === "Login") modalTitle = props.title; //Login or Sign Up
  }
  //dataObj will be the selected data point
  else if (props.pageSection === "welcome"){
    next = "#";
    if(props.title === "Cancel Reservation") modalTitle = props.title;
  }
  //====admin page editting==============
  //props.dataObj will be the selected data point
  else if(!(!props.user.token) &&
  (props.pageSection === "home" || props.pageSection === "about" || props.pageSection === "rooms"|| props.pageSection === "localGuide")){
    next = '#';
    modalTitle = `${props.title} Content`;

  }
  //======booking pageSections===========
  //props.dataObj will always be the current checkout
  else if(props.pageSection === "availability"){
    //checkout.selected is the only prop that is not directly linked to user info
    //so we have to update by hand in availability
    next="/book-now/billing";
    checkout = Object.assign({}, props.dataObj);
    //if NOT logged in, go to login modal to initialize checkout
    if(!props.user.token){
      if(props.title === "Sign Up") modalTitle = props.title;
      else if(props.title === "Select Room") modalTitle = "Login";
    }
  }

  else if(props.pageSection === "billing"){
    //edit button for going editing billing
    //edit button for moving to payment and launching payment edit
    if(props.title === "Edit Billing"){
      modalTitle = props.title; //Edit Billing
      next = "#"
    }
    else if(props.title === "Continue"){
      modalTitle = "Edit Payment";
      next = "/book-now/payment";
    }
  }

  else if(props.pageSection === "payment"){
    //edit button for going editing billing
    if(props.title === "Edit Payment"){
      modalTitle = props.title; //Edit Payment
      next = "#"
    }
    else if(props.title === "Continue"){
      next = "/book-now/confirmation";
    }
  }

  else if(props.pageSection === "confirmation"){
    next = "/welcome";
    if(props.title === "Confirm Reservation") modalTitle = props.title;
  }


  //======GET DATAOBJ AND URL FROM modalTitle==========================

  //props.dataObj is a data instance============
  if(modalTitle === "Cancel Reservation"){
    //ADD LATER!!!!



  }
  else if(modalTitle.includes("Content")){
    let result = {};
    Object.keys(props.dataObj).forEach((key) => {
      if(props.title === "Add" && key !== "_id") result[key] = '';
      else if((props.title === "Delete" || props.title === "Cancel Reservation") && key !== "_id") ;
      else result[key] = props.dataObj[key];
    });
    dataObj = Object.assign({}, result);
    //if trying to delete last room or local, send error
    if(modalTitle === "Delete Content" && props.length < 2) message.error = "You cannot delete all entries. Deleting all entries will cause errors";


    if(props.title === "Delete" && props.user.token) url = `/api/admin/${blogID}/page/${props.pageSection}/${props.dataObj._id}?token=${props.user.token}`;
    else if(props.title === "Add" && props.user.token) url = `/api/admin/${blogID}/page/${props.pageSection}?token=${props.user.token}`;
    else if(props.title === "Edit" && props.user.token) url = `/api/admin/${blogID}/page/${props.pageSection}/${props.dataObj._id}`;
  }
  //props.dataObj is {}==========================
  else if(modalTitle === "Sign Up"){
    //next already determined
    //need url and dataObj
    dataObj = Object.assign({}, {
       email: '',
       password: '',
       "verify Password": '',
       billing: initialCheckout.billing.address
    });
    url = "/page/user-setup";
  }
  else if(modalTitle === "Login"){
    dataObj = Object.assign({}, {
      username: '',
      password: '',
      admin: false
    });
    url = "/locked/userlogin"; //have to change this in EditModal if admin login
  }
  else if(modalTitle === "Send Message"){
    dataObj = Object.assign({}, {
     name: '',
     email: '',
     phone: '',
     message: ''
   });
   url = "/page/sayHello";
  }
  //dataObj is the checkout state=====================
  else if(modalTitle === "Edit Billing" || "Edit Payment"){
    if(modalTitle === "Edit Billing") dataObj = Object.assign({}, {billing: props.dataObj.billing});
    else dataObj = Object.assign({}, {payment: props.dataObj.payment});

    if(props.user.token) url=`/locked/user/${props.user.id}?token=${props.user.token}`;
  }
  else if(modalTitle === "Confirm Reservation"){
    //make sure we are logged in first
    if(this.props.user.username){
      dataObj = Object.assign({}, props.dataObj);
      if(this.props.user.admin === true){ //admin confirmation
        url = `/api/admin/${props.user.id}?token=${props.user.token}`;
      }
      else { //user confirmation
        //MAY NEED TO CHANGE LATER IS CHARGE_CLIENT NEEDS MORE INFO
        url = `/locked/user/${props.user.id}?token=${props.user.token}`;
      }
    }
  }


  //====THE ACTUAL BUTTON=====================================================

  let content = {
    message: message
  };

  //if we intitialize checkout, add it to content
  //should only be with availibility select button
  if(Object.keys(checkout).length > 0) content.checkout = checkout;

  if(modalTitle === "" && next !== "") content.edit = initialEdit;
  else if(Object.keys(dataObj).length > 0) content.edit = {
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
    <NavLink to={((modalTitle === "" && next !== "") ? next : "#")} onClick={ (e) => {
      props.updateState(content);
    }}>
      {(modalTitle === "Send Message") ?
        <a href="#">
          <FaEmail className="link faemail" />
        </a> :
        <Button bsStyle={style}>
          {props.title}
        </Button>}
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
