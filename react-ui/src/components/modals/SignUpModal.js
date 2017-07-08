import React from 'react';
import PropTypes from 'prop-types';
//import { NavLink } from 'react-router-dom';
import { Modal, Button, Form, FormControl, ControlLabel, FormGroup } from 'react-bootstrap';
import { Countries } from '../data/options';
import SignUpForm from '../forms/SignUpForm';
//var CryptoJS = require("crypto-js");

//SignUp is a modal that update login and billing state
class SignUpModal extends React.Component {
  static propTypes = {
    user: PropTypes.object.isRequired,
    editData: PropTypes.func.isRequired,
    updateState: PropTypes.func.isRequired,
    roomID: PropTypes.object.isRequired,
    message: PropTypes.object.isRequired,
    modalEdit: PropTypes.bool.isRequired,

    title: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    dataObj: PropTypes.object.isRequired,
  };

  constructor(props){
    super(props);
    this.state = {...props.dataObj}
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


  //if there is a selected room, next is book-now/billing
  render() {
    const next = (Object.keys(this.props.roomID).length === 0) ?
      "/welcome" :
      ((this.props.title === "Sign Up") ?
        "/book-now/billing":
        "#");

    return (
      <div className="main-content not-found">
        <Modal show={this.props.modalEdit} >
          <Modal.Header>
            <Modal.Title>{this.props.title}</Modal.Title>
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
              billing={this.state.billing}
              emailInfo={ (this.props.title === "Sign Up") ? {email: this.state.email, password: this.state.password} : {email: this.state.email} }
              title={this.props.title}
              user={this.props.user}

              addressChange={this.onAddressChange}
              url={this.props.url}
              editData={this.props.editData}
              message={this.props.message}
              updateState={this.props.updateState}
              next={next}
            />

          </Modal.Body>
          <Modal.Footer>
            *Fill out required fields
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}


export default SignUpModal;
