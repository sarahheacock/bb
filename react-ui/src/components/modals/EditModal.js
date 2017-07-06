import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { Modal, Button, Form, FormControl, ControlLabel, FormGroup, Alert } from 'react-bootstrap';

import { blogID } from '../data/options';
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
        token: nextProps.user.token
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
      if(k === "carousel" && Array.isArray(this.state["input"][k]) && this.state["input"][k].length === 1) results[k] = this.state["input"][k][0].split(',');
      else if(k === "carousel" && Array.isArray(this.state["input"][k]) === false) results[k] = this.state["input"][k].split(',');
      else if(k !== "_id") results[k] = this.state["input"][k]
    });
    this.props.putData(`/api/admin/${blogID}/page/${this.props.page.edit._id}/${this.props.page.page}`, results);
  }

  pop = (e) => {
    this.props.updateState({
      page: {
        ...this.props.page,
        modalVisible: {
          modalOne: false,
          modalTwo: false,
          modalThree: false,
          modalFour: false,
          modalFive: false
        }
      }
    });
  }

  render(){


    return (
      <div>
        <Modal show={this.props.page.modalVisible.modalTwo}>
          <Modal.Header>
            <Modal.Title>Edit Content</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <EditForm
              formChange={this.onFormChange}
              pop={this.pop}
              submit={this.send}
              edit={this.state.input}
              message={this.props.page.message}
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
