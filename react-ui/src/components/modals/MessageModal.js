import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Button, Form, FormControl, ControlLabel, FormGroup, Alert } from 'react-bootstrap';

import AlertMessage from '../buttons/AlertMessage';
import { initialPage } from '../data/options';


class MessageModal extends React.Component {
  static propTypes = {
    user: PropTypes.object.isRequired,
    page: PropTypes.object.isRequired,
    message: PropTypes.object.isRequired,
    postData: PropTypes.func.isRequired,
    updateState: PropTypes.func.isRequired
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
    this.props.postData (
      `user/sayHello`,
      {message: `<h3>Hello, from ${this.state.name}</h3><p><b>Message: </b>${this.state.message}</p><br /><p><b>Contact: </b>${this.state.email} ${this.state.phone}</p>`}
    );
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
    this.props.updateState({ page: initialPage });
    //this.props.resetMessage;
  }

  render(){

    const button = (this.props.message.success) ?
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
        <Modal show={this.props.page.message}>
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
                <AlertMessage
                  message={this.props.message}
                />
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
