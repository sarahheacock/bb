import React from 'react';
import PropTypes from 'prop-types';
import { Button, Form, FormControl, ControlLabel, FormGroup, Checkbox } from 'react-bootstrap';

const LoginForm = (props) => {
  return (
    <Form className="content alertMessage" >

      <FormGroup controlId="formInlineName">
        <ControlLabel>Username *</ControlLabel>
        <FormControl name="username" type="text" value={props.usernameValue} onChange={props.formChange} required/>
      </FormGroup>

      <FormGroup controlId="formInlineEmail">
        <ControlLabel>Password *</ControlLabel>
        <FormControl name="password" type="password" value={props.passwordValue} onChange={props.formChange} required/>
      </FormGroup>

      <Checkbox className="text-center" value={props.adminValue} onChange={props.checkboxChange}>
        Admin
      </Checkbox>

    </Form>

  );
}


export default LoginForm;

LoginForm.propTypes = {
  //emailValue
  //passwordValue
  formChange: PropTypes.func.isRequired,
  //adminValue
  checkboxChange: PropTypes.func.isRequired
};
