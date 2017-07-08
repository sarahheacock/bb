import React from 'react';
import PropTypes from 'prop-types';
import { Countries } from '../data/options';
import { Button, Form, FormControl, ControlLabel, FormGroup, Checkbox } from 'react-bootstrap';

import { blogID } from '../data/options';
import SubmitButtonSet from '../buttons/SubmitButtonSet';

const SignUpForm = (props) => {
  const options = Countries.map((country) => (
    <option
    key={country}
    value={country}
    >
      {country}
    </option>
  ));

  const properties = [
    {
      label: "Address Line 1 *",
      id: "line1",
      placeholder: "Street Address",
      value: props.billing.line1,
    },
    {
      label: "Address Line 2",
      id: "line2",
      placeholder: "Street Address",
      value: props.billing.line2,
    },
    {
      label: "City *",
      id: "city",
      value: props.billing.city,
    },
    {
      label: "State *",
      id: "state",
      value: props.billing.state,
    },
    {
      label: "Zip *",
      id: "zip",
      value: props.billing.zip,
    }
  ];

  const inputs = properties.map((p) => (
    <FormGroup controlId="formInlineName" key={`signup${p.id}`}>
      <ControlLabel>{p.label}</ControlLabel>
      <FormControl name={p.id} type="text" value={p.value} onChange={props.addressChange} required={p.label.includes("*")}/>
    </FormGroup>
  ));

  const results = (props.title === "Sign Up") ?
    {
      password: props.emailInfo.password,
      email: props.emailInfo.email,
      billing: `${props.billing.line1}/${props.billing.line2}/${props.billing.city}/${props.billing.state}/${props.billing.zip}/${props.billing.country}`,
      pageID: blogID
    } :
    {
      ...props.user,
      email: props.email,
      billing: `${props.billing.line1}/${props.billing.line2}/${props.billing.city}/${props.billing.state}/${props.billing.zip}/${props.billing.country}`
    };

  return (
    <div>
      <Form className="content" >
          {inputs}
          <FormGroup>
            <ControlLabel>Country *</ControlLabel>
            <FormControl name="country" componentClass="select" onChange={props.addressChange}>
              {options}
            </FormControl>
          </FormGroup>
      </Form>

      <div className="text-center">
        <SubmitButtonSet
          url={props.url}
          editData={props.editData}
          message={props.message}
          next={props.next}
          updateState={props.updateState}
          formItems={results}
          title={props.title}
          length={2}
        />
      </div>
    </div>
  );
}


export default SignUpForm;

SignUpForm.propTypes = {
  //billing: PropTypes.object.isRequired,
  emailInfo: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,

  addressChange: PropTypes.func.isRequired,
  editData: PropTypes.func.isRequired,
  updateState: PropTypes.func.isRequired,
  message: PropTypes.object.isRequired,
  next: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  user: PropTypes.object.isRequired
};
