import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { Modal, Button, Form, FormControl, ControlLabel, FormGroup, Alert } from 'react-bootstrap';


import { blogID, initialPage } from '../data/options';
import EditForm from '../forms/EditForm';

//function

class EditModal extends React.Component {
  static propTypes = {
    user: PropTypes.object.isRequired,
    edit: PropTypes.object.isRequired,
    message: PropTypes.object.isRequired,
    checkout: PropTypes.object.isRequired,

    refundClient: PropTypes.func.isRequired,
    chargeClient: PropTypes.func.isRequired,
    putData: PropTypes.func.isRequired,
    postData: PropTypes.func.isRequired,
    deleteData: PropTypes.func.isRequired,

    updateState: PropTypes.func.isRequired,
  }




  onFormChange = (e) => {
    console.log("hi");

    //const newData = this.props.edit.dataObj;
    const name = e.target.name;
    const value = (name === "carousel") ? e.target.value.split(',').map((c) => c.trim()) : e.target.value;


    this.findObjectByLabel(this.props.edit.dataObj, name, value);

    this.props.updateState({
      edit: {
        ...this.props.edit
      }
    });

  }

  findObjectByLabel = (obj, label, value) => {
    const keyArr = Object.keys(obj);

    if(keyArr.includes(label)) {
      obj[label] = value;
      return obj;
    }
    for(let i = 0; i < keyArr.length; i++){
      //console.log("hi", obj[keyArr[i]]);
      if(typeof obj[keyArr[i]] === 'object') return this.findObjectByLabel(obj[keyArr[i]], label, value);
    }
    return null;
  };


  render(){

    const title = this.props.edit.modalTitle;
    let editFunc = this.props.postData;
    if(title.includes("Edit")){
      editFunc = this.props.putData;
    }
    else if(title.includes("Delete") || title.includes("Cancel")){
      editFunc = this.props.deleteData;
    }
    else if(title.includes("Confirm")){
      editFunc = this.props.chargeClient;
    }

    //need to change the url if we are logging in
    //and the admin state is true
    const url = (title === "Login" && this.props.edit.dataObj.admin) ?
      "/api/login":
      this.props.edit.url;

    return (
      <div>
        <Modal show={Object.keys(this.props.edit.dataObj).length > 0}>
          <Modal.Header>
            <Modal.Title>{this.props.edit.modalTitle}</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <EditForm
              formChange={this.onFormChange}
              editData={editFunc}
              updateState={this.props.updateState}

              message={this.props.message}
              user={this.props.user}
              checkout={this.props.checkout}
              dataObj={this.props.edit.dataObj}

              modalTitle={this.props.edit.modalTitle}
              next={this.props.edit.next}
              url={url}
            />
          </Modal.Body>

          <Modal.Footer>
            {
              (this.props.edit.modalTitle !== "Delete Content" && this.props.edit.modalTitle !== "Cancel Reservation") ?
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
