import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { Modal, Button, Form, FormControl, ControlLabel, FormGroup, Alert } from 'react-bootstrap';


import { blogID, initialPage } from '../data/options';
import EditForm from '../forms/EditForm';

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
    let value = e.target.value;
    let newData = this.props.edit.dataObj;
    if(e.target.name === "carousel") newData[e.target.name] = value.split(',').map((c) => c.trim());
    else newData[e.target.name] = value;

    this.props.updateState({
      edit: {
        ...this.props.edit,
        dataObj: newData
      }
    });
  }


  render(){
    //THIS IS WHERE THE MAGIC HAPPENS...
    //DETERMINE NEXT PAGE WITH PAGESECTION AND MODALTITLE
    // let next = "#";
    //
    // //DETERMINE FUNCTION AND URL FROM EDIT.MODALTITLE
    // let url = `/api/admin/${blogID}/page/${this.props.edit.pageSection}`;
    // let editFunc = this.props.postData;
    //
    // if(this.props.edit.modalTitle === "Edit Content"){
    //   url = `/api/admin/${blogID}/page/${this.props.edit.pageSection}/${this.props.edit.dataObj._id}`;
    //   editFunc = this.props.putData;
    // }
    // else if(this.props.edit.modalTitle === "Delete Content"){
    //   url = `/api/admin/${blogID}/page/${this.props.edit.pageSection}/${this.props.edit.dataObj._id}?token=${this.props.user.token}`;
    //   editFunc = this.props.deleteData;
    // }
    // else if(this.props.edit.modalTitle === "Sign Up"){
    //   url = '/page/user-setup';
    //
    //   if(Object.keys(this.props.checkout.selected.roomID).length > 0) next = "/book-now/billing";
    //
    // }
    // else if(this.props.edit.modalTitle === "Login"){
    //   url = '/locked/userlogin';
    //
    //   if(this.props.edit.dataObj.admin) url = '/api/login';
    //   if(Object.keys(this.props.checkout.selected.roomID).length > 0 && this.props.edit.dataObj.admin === false) next = "/book-now/billing";
    //   if(Object.keys(this.props.checkout.selected.roomID).length > 0 && this.props.edit.dataObj.admin === true) next = "/book-now/confirmation";
    //
    // }
    // else if(this.props.edit.modalTitle === "Cancel Reservation"){
    //   if(this.props.user.admin) url = '';
    //   else url = '';
    //   editFunc = this.props.deleteData;
    // }
    // else if(this.props.edit.modalTitle === "Edit Billing"){
    //   url = `/locked/user/${this.props.user.id}?token=${this.props.user.token}`;
    //   editFunc = this.props.putData;
    // }
    // else if(this.props.edit.modalTitle === "Edit Payment"){
    //   url = `/locked/user/${this.props.user.id}?token=${this.props.user.token}`;
    //   editFunc = this.props.putData;
    //   next = "/book-now/payment";
    // }
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

              dataObj={this.props.edit.dataObj}
              modalTitle={this.props.edit.modalTitle}
              next={this.props.edit.next}
              url={this.props.edit.url}
              //length={this.props.edit.length}

              message={this.props.message}
              user={this.props.user}
              // next={next}
              // url={url}
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
