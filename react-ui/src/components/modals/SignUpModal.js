import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { Modal, Button, Form, FormControl, ControlLabel, FormGroup, Alert, Checkbox } from 'react-bootstrap';
import { Countries } from '../data/options';

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
    this.state = {
      email: '',
      password: '',
      billing: {
        line1: '',
        line2: '',
        city: '',
        state: '',
        zip: '',
        country: ''
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
      ...this.props.modalVisible,
      "client": false
    });
  }

  render() {
    const alert = (Object.keys(this.props.errorMessage).length !== 0) ?
      <Alert className="content text-center alertMessage" bsStyle="warning">{this.props.errorMessage.error}</Alert> :
      (this.props.admin.username) ?
        <Alert className="content text-center alertMessage" bsStyle="success">`Welcome, ${this.props.admin.username}`</Alert>:
        <div></div>;


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
        name: "line1",
        placeholder: "Street Address",
        value: this.state.billing.line1,
      },
      {
        label: "Address Line 2",
        name: "line2",
        placeholder: "Street Address",
        value: this.state.billing.line2,
      },
      {
        label: "City *",
        name: "city",
        value: this.state.billing.city,
      },
      {
        label: "State *",
        name: "state",
        value: this.state.billing.state,
      },
      {
        label: "Zip *",
        name: "zip",
        value: this.state.billing.zip,
      }
    ];

    const inputs = properties.map((p) => (
      <FormGroup controlId="formInlineName">
        <ControlLabel>{p.label}</ControlLabel>
        <FormControl name={p.name} type="text" value={p.value} onChange={this.onAddressChange} required={p.label.includes("*")}/>
      </FormGroup>
    ));

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

              {inputs}

              <FormGroup>
                <ControlLabel>Country *</ControlLabel>
                <FormControl name="country" componentClass="select" onChange={this.onAddressChange}>
                  {options}
                </FormControl>
              </FormGroup>

              {alert}

            </Form>
          </Modal.Body>
          <Modal.Footer>
            <button type="submit" className="btn btn-primary" onClick={this.pop}>
              <NavLink className="select" to={(this.props.checkoutSelected) ? "/book-now/billing" : "/login"} onClick={() => {
                this.props.createEmail({
                  password: this.state.password,
                  email: this.state.email,
                  billing: `${this.state.billing.line1} ${this.state.billing.line2}, ${this.state.billing.city}, ${this.state.billing.state} ${this.state.billing.zip} ${this.state.billing.country}`
                });
              }}>
                Submit
              </NavLink>
            </button>
            <button className="btn btn-danger" onClick={this.pop}>
              {(this.props.admin.username) ? "Close" : "Cancel"}
            </button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}


export default SignUpModal;
