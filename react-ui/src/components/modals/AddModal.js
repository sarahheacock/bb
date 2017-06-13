import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { Modal, Button, Form, FormControl, ControlLabel, FormGroup, Alert } from 'react-bootstrap';

class AddModal extends React.Component {
  static propTypes = {
    addVisible: PropTypes.bool.isRequired,
    makeModal: PropTypes.func.isRequired,
    addBlog: PropTypes.func.isRequired,
    errorMessage: PropTypes.object.isRequired,
    selectedAdd: PropTypes.object.isRequired,
    admin: PropTypes.object.isRequired,
  }

  constructor(props){
    super(props);

    this.state = {
      input: props.selectedAdd.data,
      section: props.selectedAdd.section,
      id: props.admin.id
    }
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.selectedAdd !== undefined) {
      this.setState({
        input: nextProps.selectedAdd.data,
        section: nextProps.selectedAdd.section,
        id: nextProps.admin.id
      });
    }
  }

  onFormChange = (e) => {
    let value = e.target.value;
    this.state.input[e.target.name] = value;
    this.setState(this.state);
  }

  send = (e) => {
    if(e) e.preventDefault();
    let results = {};
    (Object.keys(this.state.input)).forEach((k) => {
      if(k === "carousel") results[k] = this.state["input"][k].split(',');
      else if(k !== "_id") results[k] = this.state["input"][k]
    });
    this.props.addBlog({...this.state, input:results});
  }

  pop = (e) => {
    this.props.makeModal({"add": false});
  }

  render(){
    const alert = (Object.keys(this.props.errorMessage).length !== 0) ?
      <Alert className="content text-center alertMessage" bsStyle="warning">{this.props.errorMessage.error}</Alert> :
      <div></div>;


    const formItems = (this.state.input === undefined) ?
      <div></div>:
      (Object.keys(this.state.input)).map((k, index) => {
        //let value =
        if(k !== "_id") {
          return (
            <FormGroup key={`formgroup${index}`}>
              <ControlLabel>{k}</ControlLabel>
              <FormControl componentClass="Textarea"
                name={k}
                type="text"
                onChange={this.onFormChange}
              />
            </FormGroup>
          );
        }
      });

    const buttons = (this.props.admin.admin) ?
      <div>
        <Button className="edit" bsStyle="primary" type="submit">
          Submit
        </Button>
        <Button className="edit" bsStyle="danger" onClick={this.pop}>
          Cancel
        </Button>
      </div> :
      <div>
        <Button className="edit" bsStyle="info">
          <NavLink className="select" to="/login" onClick={this.pop}>
            Login Again
          </NavLink>
        </Button>
        <Button className="edit" bsStyle="danger" onClick={this.pop}>
          Cancel
        </Button>
      </div>

    return (
      <div>
        <Modal show={this.props.addVisible}>
          <Modal.Header>
            <Modal.Title>Edit Content</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <Form className="content" onSubmit={this.send}>
              {formItems}
              <div className="text-center">
                {alert}
                {buttons}
              </div>
            </Form>
          </Modal.Body>

          <Modal.Footer>
            *Fill out required fields
            <br />
            Make sure lists are only separated by commas
            <br />
            Empty fields will be filled with default text
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default AddModal;
