import React from 'react';
import PropTypes from 'prop-types';
import { Button, Modal } from 'react-bootstrap';

import AlertMessage from '../buttons/AlertMessage';
import DeleteButton from '../buttons/DeleteButton';
import { blogID, initialPage, initialMessage } from '../data/options';

class DeleteModal extends React.Component {
  static propTypes = {
    updateState: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
    deleteData: PropTypes.func.isRequired,
    pageSection: PropTypes.string.isRequired,
    dataObjID: PropTypes.string.isRequired,
    length: PropTypes.number.isRequired,
    modalDelete: PropTypes.bool.isRequired
  }

  delete = (e) => {
    if(this.props.length > 1){
      this.props.deleteData(`/api/admin/${blogID}/page/${this.props.pageSection}/${this.props.dataObjID}?token=${this.props.user.token}`);
    }
    else {
      //alert("You cannot delete all entries. Deleting all entries will cause errors");
      this.props.updateState({
        message: {
          error: "You cannot delete all entries. Deleting all entries will cause errors",
          success: ''
        }
      })
    }
  }

  close = (e) => {
    this.props.updateState({
      page: initialPage,
      message: initialMessage
    });
  }

  render() {
    return (
      <div className="text-center">

        <Modal show={this.props.modalDelete} >
          <Modal.Body>
            <div className="text-center">Are you sure you would like to delete this entry?</div>

            <AlertMessage
              message={this.props.message}
            />

          </Modal.Body>
          <Modal.Footer>
            <div className="text-center">
              <Button className="edit" bsStyle="danger" onClick={this.delete}>
                Delete
              </Button>
              <Button onClick={this.close}>
                Close
              </Button>
            </div>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }

}

export default DeleteModal;
