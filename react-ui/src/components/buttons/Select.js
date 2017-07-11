import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Button } from 'react-bootstrap';
import moment from 'moment';
import EditButton from './EditButton';

const Select = (props) => {

  return (
    <div>
    <Row className="clearfix">
      <Col className="text-center" sm={5}>
        <img src={props.upcoming.event.roomID.image} />
      </Col>
      <Col className="text-center" sm={7}>
        <h3>{props.upcoming.event.roomID.title}</h3>
        <p><b>Arrive: </b>{moment(props.upcoming.start).format('LLLL')}</p>
        <p><b>Depart: </b>{moment(props.upcoming.end + (5*60*60*1000)).format('LLLL')}</p>
        <p><b>Reserved On: </b>{moment(props.upcoming.event.createdAt).format('LLLL')}</p>
        <p><b>Guests: </b>{props.upcoming.event.guests}</p>
        <p><b>Cost: </b>{props.upcoming.event.cost}</p>
      </Col>
    </Row>
    <Row className="text-center">
      <EditButton
        admin={props.admin}
        updateState={props.updateState}
        dataObj={props.upcoming}
        title="Cancel Reservation"
        pageSection=""
        length={2}
      />
    </Row>
    <hr />
    </div>
  );
}


export default Select;

Select.propTypes = {
  upcoming: PropTypes.object.isRequired,
  admin: PropTypes.object.isRequired,
  updateState: PropTypes.func.isRequired
};
