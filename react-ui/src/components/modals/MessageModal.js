import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Button, Form, FormControl, ControlLabel, FormGroup, Alert } from 'react-bootstrap';

class MessageModal extends React.Component {
  static propTypes = {
    visible: PropTypes.bool.isRequired,
    makeModal: PropTypes.func.isRequired,
    sendMessage: PropTypes.func.isRequired,
    messageSent: PropTypes.bool.isRequired,
    errorMessage: PropTypes.object.isRequired
  }

  constructor(props){
    super(props);
    this.state = {
      name: '',
      email: '',
      phone: '',
      message: ''
    };
  }

  onFormChange = (e) => {
    this.state[e.target.name] = e.target.value;
    this.setState(this.state);
  }

  send = (e) => {
    if(e) e.preventDefault();
    this.props.sendMessage({name: this.state.name, email: this.state.email, phone: this.state.phone, message: this.state.message });
    this.state.name = '';
    this.state.email = '';
    this.state.phone = '';
    this.state.message = '';
    this.setState(this.state);
  }

  pop = (e) => {
    this.state.name = '';
    this.state.email = '';
    this.state.phone = '';
    this.state.message = '';
    this.setState(this.state);
    this.props.makeModal({"message": false});
    //this.props.resetMessage;
  }

  render(){
    const alert = (Object.keys(this.props.errorMessage).length !== 0) ?
      <Alert className="content text-center alertMessage" bsStyle="warning">{this.props.errorMessage.error}</Alert> :
      (this.props.messageSent) ?
        <Alert className="content text-center alertMessage" bsStyle="success">"Message Sent!"</Alert>:
        <div></div>;

    const button = (this.props.messageSent) ?
      <Button bsStyle="danger" onClick={this.pop}>
        Close
      </Button> :
      <div>
        <Button className="edit" bsStyle="primary" type="submit">
          Send
        </Button>
        <Button className="edit" bsStyle="danger" onClick={this.pop}>
          Cancel
        </Button>
      </div>


    return (
      <div>
        <Modal show={this.props.visible}>
          <Modal.Header>
            <Modal.Title>Leave Us a Message</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <Form className="content" onSubmit={this.send}>
              <FormGroup>
                <ControlLabel>Name *</ControlLabel>
                <FormControl name="name" type="text" value={this.state.name} onChange={this.onFormChange} required/>
              </FormGroup>

              <FormGroup>
                <ControlLabel>Phone</ControlLabel>
                <FormControl name="phone" type="text" value={this.state.phone} onChange={this.onFormChange} />
              </FormGroup>

              <FormGroup>
                <ControlLabel>Email *</ControlLabel>
                <FormControl name="email" type="email" value={this.state.email} onChange={this.onFormChange} required/>
              </FormGroup>

              <FormGroup>
                <ControlLabel>Message *</ControlLabel>
                <FormControl componentClass="Textarea" name="message" type="text" value={this.state.message} onChange={this.onFormChange} required/>
              </FormGroup>

              <div className="text-center">
                {alert}
                {button}
              </div>
            </Form>
          </Modal.Body>

          <Modal.Footer>
            *Fill out required fields
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default MessageModal;
