import React from 'react';
import PropTypes from 'prop-types';
//import { NavLink } from 'react-router-dom';
import { Modal, Button, Form, FormControl, ControlLabel, FormGroup, Alert, Checkbox } from 'react-bootstrap';
import { Countries } from '../data/options';
import SignUpForm from '../forms/SignUpForm';
//var CryptoJS = require("crypto-js");

//SignUp is a modal that update login and billing state
class SignUpModal extends React.Component {
  static propTypes = {
    createEmail: PropTypes.func.isRequired,
    makeModal: PropTypes.func.isRequired,
    modalVisible: PropTypes.object.isRequired,
    errorMessage: PropTypes.object.isRequired,
    admin: PropTypes.object.isRequired,
    checkoutSelected: PropTypes.bool.isRequired
  };

  constructor(props){
    super(props);
    this.state =
     {
      email: '',
      password: '',
      billing: {
        line1: '',
        line2: '',
        city: '',
        state: '',
        zip: '',
        country: 'United States'
      },
    }
  }

  onFormChange = (e) => {
    this.state[e.target.name] = e.target.value;
    this.setState(this.state);
  }

  onAddressChange = (e) => {
    this.state["billing"][e.target.name] = e.target.value;
    this.setState(this.state);
  }

  pop = (e) => {
    if(e) e.preventDefault();
    this.props.makeModal({
      "client": false,
      "login": false
    });
  }

  render() {
    //console.log("state", this.state.billing.country);
    const alert = (Object.keys(this.props.errorMessage).length !== 0) ?
      <Alert className="content text-center alertMessage" bsStyle="warning">{this.props.errorMessage.error}</Alert> :
      (this.props.admin.username) ?
        <Alert className="content text-center alertMessage" bsStyle="success">{`Welcome, ${this.props.admin.username}`}</Alert>:
        <div></div>;


    const submitButton = <button type="submit" className="btn btn-primary" onClick={() => {

        this.props.createEmail({
          password: this.state.password,
          email: this.state.email,
          billing: `${this.state.billing.line1}/${this.state.billing.line2}/${this.state.billing.city}/${this.state.billing.state}/${this.state.billing.zip}/${this.state.billing.country}`
        });

        this.props.makeModal({
          client: false,
          login: true
        });
      }}>
        Submit
    </button>;

    const closeButton = <button className="btn btn-danger" onClick={this.pop}>
      {(this.props.admin.username) ? "Close" : "Cancel"}
    </button>;

    return (
      <div className="main-content not-found">
        <Modal show={this.props.modalVisible.client} >
          <Modal.Header>
            <Modal.Title>Sign Up</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form className="content" onSubmit={this.verify}>
              <FormGroup controlId="formInlineName">
                <ControlLabel>Username *</ControlLabel>
                <FormControl name="email" type="text" value={this.state.email} onChange={this.onFormChange} required/>
              </FormGroup>

              <FormGroup controlId="formInlineEmail">
                <ControlLabel>Password *</ControlLabel>
                <FormControl name="password" type="password" value={this.state.password} onChange={this.onFormChange} required/>
              </FormGroup>
            </Form>

            <SignUpForm
              line1Value={this.state.billing.line1}
              line2Value={this.state.billing.line2}
              cityValue={this.state.billing.city}
              stateValue={this.state.billing.state}
              zipValue={this.state.billing.zip}
              countryValue={this.state.billing.country}
              addressChange={this.onAddressChange}
            />

          </Modal.Body>
          <Modal.Footer>
            <div className="text-center">
              {alert}
              {submitButton}{closeButton}
            </div>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}


export default SignUpModal;
