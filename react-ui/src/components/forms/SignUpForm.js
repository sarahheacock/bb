import React from 'react';
import PropTypes from 'prop-types';
import { Countries } from '../data/options';
import { Button, Form, FormControl, ControlLabel, FormGroup, Checkbox } from 'react-bootstrap';

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
      value: props.line1Value,
    },
    {
      label: "Address Line 2",
      id: "line2",
      placeholder: "Street Address",
      value: props.line2Value,
    },
    {
      label: "City *",
      id: "city",
      value: props.cityValue,
    },
    {
      label: "State *",
      id: "state",
      value: props.stateValue,
    },
    {
      label: "Zip *",
      id: "zip",
      value: props.zipValue,
    }
  ];

  const inputs = properties.map((p) => (
    <FormGroup controlId="formInlineName">
      <ControlLabel>{p.label}</ControlLabel>
      <FormControl name={p.id} type="text" value={p.value} onChange={props.addressChange} required={p.label.includes("*")}/>
    </FormGroup>
  ));

  return (
      <Form className="content">

          {inputs}

          <FormGroup>
            <ControlLabel>Country *</ControlLabel>
            <FormControl name="country" componentClass="select" onChange={props.addressChange}>
              {options}
            </FormControl>
          </FormGroup>

      </Form>
  );
}


export default SignUpForm;

SignUpForm.propTypes = {
  addressChange: PropTypes.func.isRequired
};
