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

  constructor(props){
    super(props);
    this.state = {
      input: props.edit.dataObj
    }
  }

  componentWillReceiveProps(nextProps){
    if(Object.keys(nextProps.edit.dataObj).length > 0) {
      this.setState({
        input: nextProps.edit.dataObj,
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
    //THIS IS WHERE THE MAGIC HAPPENS...
    //DETERMINE NEXT PAGE WITH PAGESECTION AND MODALTITLE
    const next = (this.props.pageSection !== "book-now") ?
      "#":
      "/book-now/billing";

    //DETERMINE FUNCTION AND URL FROM EDIT.MODALTITLE
    let url = `/api/admin/${blogID}/page/${this.props.edit.pageSection}`;
    let editFunc = this.props.postData;

    if(this.props.edit.modalTitle === "Edit Content"){
      url = `/api/admin/${blogID}/page/${this.props.edit.pageSection}/${this.props.edit.dataObj._id}`;
      editFunc = this.props.putData;
    }
    else if(this.props.edit.modalTitle === "Delete Content"){
      url = `/api/admin/${blogID}/page/${this.props.edit.pageSection}/${this.props.edit.dataObj._id}?token=${this.props.user.token}`;
      editFunc = this.props.deleteData;
    }
    else if(this.props.edit.modalTitle === "Sign Up"){
      url = '/page/user-setup';
    }
    else if(this.props.edit.modalTitle === "Cancel Reservation"){
      if(this.props.user.admin) url = '';
      else url = '';
      editFunc = this.props.deleteData;
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

              message={this.props.message}
              dataObj={this.state.input}
              modalTitle={this.props.edit.modalTitle}
              length={this.props.edit.length}

              user={this.props.user}
              next={next}
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
