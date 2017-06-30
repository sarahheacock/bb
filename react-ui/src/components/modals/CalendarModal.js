import React from 'react';
import PropTypes from 'prop-types';
import { PageHeader, Button, Row, Col, Modal, Alert } from 'react-bootstrap';
import moment from 'moment';

class CalendarModal extends React.Component {
  static propTypes = {
    // data: PropTypes.array.isRequired,
    // admin: PropTypes.object.isRequired,
    // logout: PropTypes.func.isRequired,
    // fetchClient: PropTypes.func.isRequired,
    // refundClient: PropTypes.func.isRequired,
    makeModal: PropTypes.func.isRequired,
    modalVisible: PropTypes.object.isRequired,
    errorMessage: PropTypes.object.isRequired,
    upcoming: PropTypes.object.isRequired
  }

  // componentDidMount(){
  //   this.props.fetchClient(`/locked/user/${this.props.admin.user}/detail/?token=${this.props.admin.id}`);
  // }

  handleCancel = (e) => {
    // this.props.refundClient({
    //   admin: this.props.admin,
    //   upcomingID: this.state.target
    // });

    if (Object.keys(this.props.errorMessage).length === 0){
      this.props.makeModal({client: false})
    }
  }

  render(){

    const alert = (Object.keys(this.props.errorMessage).length !== 0) ?
      <Alert className="content text-center alertMessage" bsStyle="warning">{this.props.errorMessage.error}</Alert> :
      <div></div>;

    return (
      <div className="main-content">
        <Modal show={this.props.modalVisible.client} >
          <Modal.Body>
            <div className="text-center">Are you sure you would like to cancel your reservation?</div>
            {alert}
          </Modal.Body>
          <Modal.Footer>
            <div className="text-center">
              <Button bsStyle="danger" onClick={this.handleCancel}>
                Cancel Reservation
              </Button>
              <Button onClick={() => this.props.makeModal({client: false})}>
                Close
              </Button>
            </div>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default CalendarModal;
