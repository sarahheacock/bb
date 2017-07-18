import React from 'react';
import PropTypes from 'prop-types';
import { Button, Form, FormControl, ControlLabel, FormGroup, Checkbox } from 'react-bootstrap';

import Select from '../buttons/Select';
import SubmitButtonSet from '../buttons/SubmitButtonSet';
import { Months, Years, Countries, initialCheckout } from '../data/options';


const EditForm = (props) => {
  //=======ERROR MESSAGES=========================================
  const formError = "*Fill out required fields";
  const passwordError = "Passwords must match";
  const expError = "Invalid Expiration Date";

  //======KEYS USED TO CREATE FORM================================
  let thisObj = {};
  if(props.modalTitle === "Edit Billing"){
    thisObj = Object.assign({}, {
      email: props.dataObj.billing.email,
      ...props.dataObj.billing.address
    });
  }
  else if(props.modalTitle === "Edit Payment"){
    thisObj = {
      ...initialCheckout.payment,
      ...props.dataObj.payment
    };
  }
  else {
    thisObj = {...props.dataObj};
  }

  //======ALL OF THE FORM GROUPS===================================
  const formItems = (Object.keys(thisObj).length < 1) ?
    <div></div>: //confirmation will not dataObj={}

    (props.modalTitle === "Look Up") ?
      <Select
        upcoming={thisObj}
        admin={props.user.admin}
        updateState={props.updateState}
      /> :

      (Object.keys(thisObj)).map((k, index) => {
        //all values that we do not want a form entry for
        if(k !== "_id" && k !== "billed") {
          const title = (k === "bold" || k === "link" || k === "Address Line 2" || k === "phone") ?
            `${k.charAt(0).toUpperCase()}${k.slice(1)}`:
            `${k.charAt(0).toUpperCase()}${k.slice(1)}*`;

          const type = (k === "password" || k === "verify Password") ?
            "password":
            "text";

          const compClass = (k === "bold" || k === "summary" || k === "description" || k === "carousel" || k === "message") ?
            "textarea":
            "input";


          const valid = ((props.message.error === passwordError && (k === "password" || k === "verify Password")) ||
          (props.message.error === formError && !thisObj[k] && title.includes("*")) ||
          (props.message.error === expError && k.includes("Expiration"))) ?
            "warning":
            null;


          let formGroup = <FormControl componentClass={compClass}
              type={type}
              name={k}
              value={(thisObj[k]) ? thisObj[k].toString() : ''}
              onChange={props.formChange}
            />;

          if (k === "admin"){
            formGroup = <Checkbox value={thisObj[k]} onChange={props.formChange} name="admin">
              Admin
            </Checkbox>;
          }
          else if (k === "country" || k === "Expiration Month" || k === "Expiration Year"){
            const options = (k === "Expiration Month") ?
              Months.map((month) => (
                <option value={month} key={month}>
                  {month}
                </option>
              )) :
              ((k === "Expiration Year") ?
                Years.map((year) => (
                  <option value={year} key={year}>
                    {year}
                  </option>
                )) :
                Countries.map((country) => (
                  <option
                  key={country}
                  value={country}
                  >
                    {country}
                  </option>
                ))
              );

              formGroup = <FormControl name={k} value={thisObj[k]} componentClass="select" onChange={props.formChange} key={`formgroup${index}`}>
                {options}
              </FormControl>
          }

          return (
            <FormGroup key={`formgroup${index}`} validationState={valid}>
              <ControlLabel>{title}</ControlLabel>
              {formGroup}
            </FormGroup>
          );
        }
      });



  //==========REFORMAT SUMBITTED DATA=============================
  let results = {...props.dataObj};
  // if(props.modalTitle.includes("Content") || props.modalTitle.includes("Content")){
  //   results = {...props.dataObj};
  // }
  // else
  if(props.modalTitle === "Send Message"){
    results = {message: `<h3>Hello, from ${thisObj.name}</h3><p><b>Message: </b>${thisObj.message}</p><br /><p><b>Contact: </b>${thisObj.email} ${thisObj.phone}</p>`}
  }
  else {
    //make sure unrequired fields are defaulted
    if(results.link && results.link === "") results.link = "#";
    if(results.admin === false) results.email = props.dataObj.username;
    if(results._id) results.token = props.user.token;

    // Object.keys(props.dataObj).forEach((key) => {
    //   if(key === "_id") results.token = props.user.token;
    //   else if(key === "link" && (props.dataObj[key] === "" || props.dataObj[key] === undefined)) results[key] = "#";
    //   //else if((key === "bold" || key === "Address Line 2") && (props.dataObj[key] === "" || props.dataObj[key] === undefined)) results[key] = " ";
    //   else if (key === "username" && props.dataObj.admin === false) results.email = props.dataObj[key];
    //   else results[key] = props.dataObj[key];
    // });
  }


  //================ERROR HANDLING===================================
  //used for all forms to make sure required fields are filled
  const formValid = Object.keys(thisObj).reduce((a, b) => {
    const test = (thisObj[b] !== true && thisObj[b] !== false) ?
      thisObj[b][0]:
      thisObj[b];

    //required value filled
    //or unrequired fields
    return ((a && test !== "" && test !== undefined) ||
    (a && (b === "bold" || b === "Address Line 2" || b === "link" || b === "phone")));
  }, true);

  //used for sign up to make sure passwords match
  const passwordValid = (thisObj["verify Password"]) ?
    thisObj["verify Password"] === thisObj["password"] :
    true;

  //if expiration date is invalid for payment form
  const d = new Date();
  const currentYear = d.getFullYear();
  const currentMonth = d.getMonth() + 1;

  const expValid = (thisObj["Expiration Month"]) ?
    (parseInt(thisObj["Expiration Year"]) > currentYear || thisObj["Expiration Month"].split(' ')[1] > currentMonth):
    true;

  let message = Object.assign({}, props.message);
  if(message.error === ''){
    if(!formValid) message.error = formError;
    else if(!passwordValid) message.error = passwordError;
    else if(!expValid) message.error = expError;
  }


  //============================================================


  return (
    <Form className="content">
      {
        (props.modalTitle === "Delete Content") ?
          <div className="text-center">Are you sure you want to delete this content?</div>:
          ((props.modalTitle === "Cancel Reservation") ?
            <div className="text-center">Are you sure you want to Cancel your Reservation?</div>:
            <div>{formItems}</div>)
      }
      <div className="text-center">
        <SubmitButtonSet
          editData={props.editData}
          updateState={props.updateState}

          message={message}
          user={props.user}
          formItems={results}

          title={props.modalTitle}
          next={props.next}
          url={props.url}
        />
      </div>
    </Form>
  );
}


export default EditForm;

EditForm.propTypes = {
  formChange: PropTypes.func.isRequired,
  editData: PropTypes.func.isRequired,
  updateState: PropTypes.func.isRequired,

  message: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  checkout: PropTypes.object.isRequired,
  dataObj: PropTypes.object.isRequired,

  modalTitle: PropTypes.string.isRequired,
  next: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
};
