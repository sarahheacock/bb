import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { Modal, Button, Form, FormControl, ControlLabel, FormGroup, Alert } from 'react-bootstrap';

import { blogID, initialPage } from '../data/options';
import EditForm from '../forms/EditForm';

class EditModal extends React.Component {
  static propTypes = {
    user: PropTypes.object.isRequired,
    editData: PropTypes.func.isRequired,
    updateState: PropTypes.func.isRequired,
    url: PropTypes.string.isRequired,
    next: PropTypes.string.isRequired,
    dataObj: PropTypes.object.isRequired,
    message: PropTypes.object.isRequired,
    modalEdit: PropTypes.bool.isRequired,
    //dataLength: PropTypes.number.isRequired
  }

  constructor(props){
    super(props);
    this.state = {
      input: props.dataObj
    }
  }

  componentWillReceiveProps(nextProps){
    if(Object.keys(nextProps.dataObj).length > 0) {
      this.setState({
        input: nextProps.dataObj,
      });
    }
  }

  onFormChange = (e) => {
    let value = e.target.value;
    if(e.target.name === "carousel") this.state.input[e.target.name] = value.split(',').map((c) => c.trim());
    else this.state.input[e.target.name] = value;
    this.setState(this.state);
  }


  render(){

    return (
      <div>
        <Modal show={this.props.modalEdit}>
          <Modal.Header>
            <Modal.Title>{this.props.dataObj.modalTitle}</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <EditForm
              formChange={this.onFormChange}
              updateState={this.updateState}
              url={this.props.url}
              editData={this.props.editData}
              edit={this.state.input}
              message={this.props.message}
              updateState={this.props.updateState}
              token={this.props.user.token}
              next={this.props.next}
            />
          </Modal.Body>

          <Modal.Footer>
            {
              (this.props.dataObj.modalTitle !== "Delete Content") ?
                <div>
                  *Fill out required fields
                  <br />
                  Make sure lists are only separated by commas
                  <br />
                  Empty fields will be filled with default text
                </div> :
                <div></div>
            }
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default EditModal;
