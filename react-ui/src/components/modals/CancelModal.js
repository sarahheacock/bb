import React from 'react';
import PropTypes from 'prop-types';
import { Button, Modal } from 'react-bootstrap';

import AlertMessage from '../buttons/AlertMessage';
import { blogID, initialPage, initialMessage } from '../data/options';

class CancelModal extends React.Component {
  static propTypes = {
    user: PropTypes.object.isRequired,
    message: PropTypes.object.isRequired,
    refundClient: PropTypes.func.isRequired,
    updateState: PropTypes.func.isRequired,
    upcomingID: PropTypes.string.isRequired,
    modalDelete: PropTypes.bool.isRequired
  }


  handleCancel = (e) => {
    this.props.refundClient({
      user: this.props.user,
      upcomingID: this.props.upcomingID
    });

    if(this.props.message.success){
      this.props.updateState({
        page: initialPage,
        message: initialMessage
      });
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
            <div className="text-center">Are you sure you would like to cancel your reservation?</div>

            <AlertMessage
              message={this.props.message}
            />

          </Modal.Body>
          <Modal.Footer>
            <div className="text-center">
              <Button bsStyle="danger" onClick={this.handleCancel}>
                Cancel Reservation
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

export default CancelModal;
