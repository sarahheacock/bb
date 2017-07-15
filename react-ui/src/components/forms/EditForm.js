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

  //======ALL OF THE FORM GROUPS===================================
  const formItems = (Object.keys(props.dataObj).length < 1) ?
    <div></div>: //confirmation will not dataObj={}

    (props.modalTitle === "Look Up") ?
      <Select
        upcoming={props.dataObj}
        admin={props.user.admin}
        updateState={props.updateState}
      /> :

      (Object.keys(props.dataObj)).map((k, index) => {
        //all values that we do not want a form entry for
        if(k !== "_id" && k !== "billed") {
          const title = (k === "bold" || k === "link" || k === "Address Line 2") ?
            `${k.charAt(0).toUpperCase()}${k.slice(1)}`:
            `${k.charAt(0).toUpperCase()}${k.slice(1)}*`;

          const type = (k === "password" || k === "verify Password") ?
            "password":
            "text";

          const compClass = (k === "bold" || k === "summary" || k === "description" || k === "carousel") ?
            "textarea":
            "input";


          const valid = ((props.message.error === passwordError && (k === "password" || k === "verify Password")) ||
          (props.message.error === formError && !props.dataObj[k]) ||
          (props.message.error === expError && k.includes("Expiration"))) ?
            "warning":
            null;


          let formGroup = <FormControl componentClass={compClass}
              type={type}
              name={k}
              value={(props.dataObj[k]) ? props.dataObj[k].toString() : ''}
              onChange={props.formChange}
            />;

          if (k === "admin"){
            formGroup = <Checkbox value={props.dataObj[k]} onChange={props.formChange} name="admin">
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

              formGroup = <FormControl name={k} componentClass="select" onChange={props.formChange} key={`formgroup${index}`}>
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
  let results = {};

  //format into checkout if editting user info in booking
  if(props.modalTitle === "Edit Billing"){
    //put address back into separate object
    let newAddress = {};
    (Object.keys(initialCheckout.billing.address)).forEach((k) => {
      newAddress[k] = props.dataObj[k];
    });

    results = Object.assign({}, {
      ...props.checkout,
      billing: {
        ...props.checkout.billing,
        email: props.dataObj.email,
        address: newAddress
      }
    });
  }
  else if(props.modalTitle === "Edit Payment"){
    results = Object.assign({}, {
      ...props.checkout,
      payment: {
        ...props.checkout.payment,
        ...props.dataObj
      }
    });
  }
  else { //make sure unrequired fields are defaulted
    Object.keys(props.dataObj).forEach((key) => {
      if(key === "_id") results.token = props.user.token;
      else if(key === "link" && (props.dataObj[key] === "" || props.dataObj[key] === undefined)) results[key] = "#";
      //else if((key === "bold" || key === "Address Line 2") && (props.dataObj[key] === "" || props.dataObj[key] === undefined)) results[key] = " ";
      else if (key === "username" && props.dataObj.admin === false) results.email = props.dataObj[key];
      else results[key] = props.dataObj[key];
    });
  }

  //================ERROR HANDLING===================================
  //used for all forms to make sure required fields are filled
  const formValid = Object.keys(props.dataObj).reduce((a, b) => {
    const test = (props.dataObj[b] !== true && props.dataObj[b] !== false) ?
      props.dataObj[b][0]:
      props.dataObj[b];

    //required value filled
    //or unrequired fields
    return ((a && test !== "" && test !== undefined) ||
    (a && (b === "bold" || b === "Address Line 2" || b === "link")));
  }, true);

  //used for sign up to make sure passwords match
  const passwordValid = (props.dataObj["verify Password"]) ?
    props.dataObj["verify Password"] === props.dataObj["password"] :
    true;

  //if expiration date is invalid for payment form
  const d = new Date();
  const currentYear = d.getFullYear();
  const currentMonth = d.getMonth() + 1;

  const expValid = (props.dataObj["Expiration Month"]) ?
    (parseInt(this.props.formItems["Expiration Year"]) > currentYear || this.props.formItems["Expiration Month"].split(' ')[1] > currentMonth):
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
