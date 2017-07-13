import React from 'react';
import PropTypes from 'prop-types';
import { Button, Form, FormControl, ControlLabel, FormGroup, Checkbox } from 'react-bootstrap';

import Select from '../buttons/Select';
import SubmitButtonSet from '../buttons/SubmitButtonSet';
import { Months, Years, Countries } from '../data/options';


const EditForm = (props) => {

  const formItems = (Object.keys(props.dataObj).length < 1) ?
    <div></div>:
    (props.modalTitle === "Look Up") ?
      <Select
        upcoming={props.dataObj}
        admin={props.user.admin}
        updateState={props.updateState}
      /> :

      (Object.keys(props.dataObj)).map((k, index) => {
        //let value =
        if(k !== "_id") {
          const title = (k === "bold" || k === "link" || k === "Address Line 2") ?
            `${k.charAt(0).toUpperCase()}${k.slice(1)}`:
            `${k.charAt(0).toUpperCase()}${k.slice(1)}*`;

          const type = (k === "password" || k === "verify Password") ?
            "password":
            ((k === "bold" || k === "summary" || k === "description") ?
              "textarea":
              "text"
            );


          const valid = ((props.message.error === "Passwords must match" && (k === "password" || k === "verify Password")) ||
          (props.message.error === "Fill out required fields" && !props.dataObj[k]) ||
          (props.message.error === "Invalid Expiration Date" && k.includes("Expiration"))) ?
            "warning":
            "null";


          let formGroup = <FormControl
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
            <FormGroup key={`formgroup${index}`} controlID={`control${index}`} validationState={valid}>
              <ControlLabel>{title}</ControlLabel>
              {formGroup}
            </FormGroup>
          );
        }
      });


//console.log("form", props.dataObj);

  let results = {};
  Object.keys(props.dataObj).forEach((key) => {
    if(key === "_id") results.token = props.user.token;
    else if(key === "link" && (props.dataObj[key] === "" || props.dataObj[key] === undefined)) results[key] = "#";
    else if((key === "bold" || key === "Address Line 2") && (props.dataObj[key] === "" || props.dataObj[key] === undefined)) results[key] = " ";
    else if (key === "username" && props.dataObj.admin === false) results.email = props.dataObj[key];
    else results[key] = props.dataObj[key];
  });


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

          url={props.url}
          next={props.next}
          message={props.message}
          user={props.user}

          formItems={results}
          length={props.length}
          title={props.modalTitle}
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
  dataObj: PropTypes.object.isRequired,
  modalTitle: PropTypes.string.isRequired,
  length: PropTypes.number.isRequired,

  //token: PropTypes.string.isRequired,
  next: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
};
