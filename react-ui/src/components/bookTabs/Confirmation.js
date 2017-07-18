import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-bootstrap';
import moment from 'moment';
import EditButton from '../buttons/EditButton';


const Confirmation = (props) => {
  const selected = props.checkout.selected;

  const billing = props.checkout.billing;
  const address = Object.keys(billing.address).map((k) => (
    <p><b>{`${k.charAt(0).toUpperCase()}${k.slice(1)}: `}</b>{billing.address[k]}</p>
  ));

  const payment = props.checkout.payment;
  const paymentInfo = Object.keys(payment).map((k) => (
    <p><b>{`${k.charAt(0).toUpperCase()}${k.slice(1)}: `}</b>{payment[k]}</p>
  ));

  return (
    <div className="main-content">
      <Row className="clearfix">
        <Col className="text-center" sm={5}>
          <h4>Room:</h4>
        </Col>
        <Col className="text-center" sm={7}>
          <h3>{selected.roomID.title}</h3>
          <img src={selected.roomID.image} />
          <p><b>Arrive: </b>{moment(selected.arrive).format('LLLL')}</p>
          <p><b>Depart: </b>{moment(selected.depart + (5*60*60*1000)).format('LLLL')}</p>
          <p><b>Guests: </b>{selected.guests}</p>
          <p><b>Cost: </b>{selected.cost}</p>
        </Col>
      </Row>
      <hr />

      <Row className="clearfix">
        <Col className="text-center" sm={5}>
          <h4>Billing Address:</h4>
        </Col>
        <Col className="text-center" sm={7}>
          <h3>{billing["email"]}</h3>
          <div>{address}</div>
        </Col>
      </Row>
      <hr />

      <Row className="clearfix">
        <Col className="text-center" sm={5}>
          <h4>Payment:</h4>
        </Col>
        <Col className="text-center" sm={7}>
          <div>{paymentInfo}</div>
        </Col>
      </Row>
      <hr />

      <div className="text-center">
        <EditButton
          user={props.user}
          updateState={props.updateState}
          dataObj={props.checkout}
          title="Confirm Reservation"
          pageSection="confirmation"
          length={2}
        />
      </div>
    </div>
  );
}


export default Confirmation;

Confirmation.propsTypes = {
  user: PropTypes.object.isRequired,
  checkout: PropTypes.object.isRequired,

  updateState: PropTypes.func.isRequired,
};
