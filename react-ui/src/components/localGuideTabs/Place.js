import React from 'react';
import PropTypes from 'prop-types';
import { Col, Row, Button } from 'react-bootstrap';
import moment from 'moment';

// import EditButton from '../buttons/EditButton';
// import AddButton from '../buttons/AddButton';
// import DeleteModal from '../modals/DeleteModal';
// import DeleteButton from '../buttons/DeleteButton';
// import { blogID, initialPage } from '../data/options';


const Place = (props) => {

    //put data in appropiate categories
    //make sure data is defined
    let events = <div>Loading</div>;

    if(props.data){
      if(props.data["address"] !== undefined && props.data["title"] !== undefined){
        events = <div className="content">
              <Row className="clearfix">
                <h3>{props.data.title}</h3>
                <Row className="clearfix">
                  <Col sm={7}>
                    <p>{props.data.description}</p>
                    <p><b>{props.data.address}</b></p>
                  </Col>
                  <Col sm={5}>
                    <img src={props.data.image}/>
                  </Col>
                </Row>
              </Row>
            </div>
      }
    }


    return (
      <div className="content">
        {events}
      </div>
    );

}

export default Place;

Place.propTypes = {
  data: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  updateState: PropTypes.func.isRequired
}
