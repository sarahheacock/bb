import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { Modal, Button, Form, FormControl, ControlLabel, FormGroup, Alert } from 'react-bootstrap';

import { blogID, initialPage } from '../data/options';
import EditForm from '../forms/EditForm';

class EditModal extends React.Component {
  static propTypes = {
    //selectedEdit: PropTypes.object.isRequired,
    page: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    putData: PropTypes.func.isRequired,
    updateState: PropTypes.func.isRequired,
  }

  constructor(props){
    super(props);

    this.state = {
      input: props.page.edit,
      //valid: true,
      section: props.page.page,
      sectionID: props.page.edit._id,
      token: props.user.token
    }
  }

  componentWillReceiveProps(nextProps){
    if(Object.keys(nextProps.page.edit).length > 0) {
      this.setState({
        input: nextProps.page.edit,
        section: nextProps.page.page,
        sectionID: nextProps.page.edit._id,
        token: nextProps.user.token,
        //valid: true
      });
    }
  }

  onFormChange = (e) => {
    let value = e.target.value;
    this.state.input[e.target.name] = value;
    // this.state.valid = Object.keys(this.state.input).reduce((a, b) => {
    //   return (a && this.state.input[b] !== undefined);
    // }, true);
    this.setState(this.state);
  }

  send = (e) => {
    if(e) e.preventDefault();
    let results = {
      token: this.state.token
    };
    (Object.keys(this.state.input)).forEach((k) => {
      if(k === "carousel" && Array.isArray(this.state["input"][k]) && this.state["input"][k].length === 1) results[k] = this.state["input"][k][0].split(',');
      else if(k === "carousel" && Array.isArray(this.state["input"][k]) === false) results[k] = this.state["input"][k].split(',');
      else if(k !== "_id") results[k] = this.state["input"][k]
    });
    this.props.putData(`/api/admin/${blogID}/page/${this.state.section}/${this.state.sectionID}`, results);
  }


  render(){


    return (
      <div>
        <Modal show={this.props.page.modalVisible.edit}>
          <Modal.Header>
            <Modal.Title>Edit Content</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <EditForm
              formChange={this.onFormChange}
              updateState={this.updateState}
              onSubmit={this.send}
              edit={this.state.input}
              message={this.props.message}
              updateState={this.props.updateState}
              token={this.props.user.token}
            />
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

export default EditModal;
