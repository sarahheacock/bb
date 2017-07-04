import React from 'react';
import PropTypes from 'prop-types';
import { PageHeader, Button, Row, Col, Modal, Alert, Form, FormGroup, ControlLabel, FormControl } from 'react-bootstrap';
import PayForm from '../forms/PayForm';
import moment from 'moment';

class CalendarModal extends React.Component {
  static propTypes = {
    // data: PropTypes.array.isRequired,
    // admin: PropTypes.object.isRequired,
    // logout: PropTypes.func.isRequired,
    // fetchClient: PropTypes.func.isRequired,
    refundClient: PropTypes.func.isRequired,
    admin: PropTypes.object.isRequired,
    makeModal: PropTypes.func.isRequired,
    modalVisible: PropTypes.object.isRequired,
    errorMessage: PropTypes.object.isRequired,
    upcoming: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);
    const y = new Date().getFullYear().toString();
    this.state = {
      payment: 'credit',
      paymentForms: {
        credit: {
          name: '',
          number: '',
          month: "Jan",
          year: y,
          cvv: ''
        },
        cash: {
          amount: ''
        },
        check: {
          number: ''
        },
        other: {
          notes: ''
        }
      }
    }
  }

  handleCancel = (e) => {
    this.props.refundClient({
      admin: this.props.admin,
      upcomingID: e.target.name
    });

    if (Object.keys(this.props.errorMessage).length === 0){
      this.props.makeModal({client: false})
    }
  }

  handleCheckIn = () => {
    if (Object.keys(this.props.errorMessage).length === 0){
      this.props.makeModal({client: false})
    }
  }

  handleFormChange = (e) => {
    this.state[e.target.name] = e.target.value;
    this.setState(this.state);
  }

  handlePayFormChange = (e) => {
    this.state.paymentForms[this.state.payment][e.target.name] = e.target.value;
    this.setState(this.state);
  }

  render(){
    console.log(this.state);
    const alert = (Object.keys(this.props.errorMessage).length !== 0) ?
      <Alert className="content text-center alertMessage" bsStyle="warning">{this.props.errorMessage.error}</Alert> :
      <div></div>;

    let upcomingStay = <div></div>;
    if(this.props.upcoming){
      if(this.props.upcoming.event){
        upcomingStay = <div>
          <Row className="clearfix">
            <Col className="text-center" sm={5}>
              <img src={this.props.upcoming.event.roomID.image} />
            </Col>
            <Col className="text-center" sm={7}>
              <h3>{this.props.upcoming.event.roomID.title}</h3>
              <p><b>Arrive: </b>{moment(this.props.upcoming.start).format('LLLL')}</p>
              <p><b>Depart: </b>{moment(this.props.upcoming.end + (5*60*60*1000)).format('LLLL')}</p>
              <p><b>Reserved On: </b>{moment(this.props.upcoming.event.createdAt).format('LLLL')}</p>
              <p><b>Guests: </b>{this.props.upcoming.event.guests}</p>
              <p><b>Cost: </b>{this.props.upcoming.event.cost}</p>
            </Col>
          </Row>
          <Row className="text-center">
            <Button onClick={this.handleCancel} name={this.props.upcoming._id}>Cancel Reservation</Button>
          </Row>
          <hr />
          <Row>
          {
            (this.props.upcoming.event.credit) ?
              <p><b>Payment: </b>{this.props.upcoming.event.credit}</p> :
              <Form>
                <FormGroup className="main-content">
                  <ControlLabel>Method of Payment *</ControlLabel>
                  <FormControl name="payment" componentClass="select" value={this.state.payment} onChange={this.handleFormChange}>
                    {Object.keys(this.state.paymentForms).map(pay => (
                      <option value={pay} key={pay}>
                        {pay}
                      </option>
                    ))}
                  </FormControl>
                </FormGroup>
              </Form>
        }
          </Row>
        </div>
      }
    }


    return (
      <div className="main-content">
        <Modal show={this.props.modalVisible.client} >
          <Modal.Body>
            {upcomingStay}

              {(this.props.upcoming.event)?
                ((!this.props.upcoming.event.credit) ?
                (this.state.payment === "credit") ?
                  <PayForm
                    nameValue={this.state.paymentForms.credit.name}
                    numberValue={this.state.paymentForms.credit.number}
                    cvvValue={this.state.paymentForms.credit.cvv}
                    monthValue={this.state.paymentForms.credit.month}
                    yearValue={this.state.paymentForms.credit.year}
                    creditChange={this.handlePayFormChange}
                  /> :
                  <Form>
                    {Object.keys(this.state.paymentForms[this.state.payment]).map((k) => (
                      <FormGroup>
                        <ControlLabel>{k}</ControlLabel>
                        <FormControl name={k} type="text" value={this.state.paymentForms[this.state.payment][k]} onChange={this.handlePayFormChange}/>
                      </FormGroup>
                    ))}
                  </Form>
                :
                <div></div>):
                <div></div>}

            {alert}
          </Modal.Body>
          <Modal.Footer>
            <div className="text-center">
              <Button bsStyle="primary" onClick={this.handleCheckIn}>
                Check-in
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
