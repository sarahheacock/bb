import React from 'react';
import PropTypes from 'prop-types';
import { Button, Form, FormControl, ControlLabel, FormGroup, Checkbox } from 'react-bootstrap';

import LoginButtonSet from '../buttons/LoginButtonSet';

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

      <LoginButtonSet
        updateState={props.updateState}
        message={props.message}
        next={props.next}
        postData={props.postData}
        url={(props.adminValue) ? '/api/login' : '/locked/userlogin'}
        formItems={(props.adminValue) ? {username: props.usernameValue, password: props.passwordValue} : {email:props.usernameValue, password: props.passwordValue}}
      />

    </Form>

  );
}


export default LoginForm;

LoginForm.propTypes = {
  passwordValue: PropTypes.string.isRequired,
  usernameValue: PropTypes.string.isRequired,
  adminValue: PropTypes.bool.isRequired,

  formChange: PropTypes.func.isRequired,
  checkboxChange: PropTypes.func.isRequired,

  postData: PropTypes.func.isRequired,
  message: PropTypes.object.isRequired,
  updateState: PropTypes.func.isRequired,
  next: PropTypes.string.isRequired,
};
