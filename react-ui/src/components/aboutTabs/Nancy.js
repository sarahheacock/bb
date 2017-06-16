import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Button } from 'react-bootstrap';
import EditModal from '../modals/EditModal';

const Nancy = (props) => {
  const editButton = (props.admin.admin) ?
    <Button bsStyle="info" onClick={() => props.selectEdit({data:props.data, section:"about"})}>
      Edit
    </Button> :
    <div></div>;

  return (
    <div className="main-content">

      {(props.data === undefined) ?
        <div>Loading</div> :
        <Row className="clearfix content">
          <h3>{props.data.title}</h3>
          <Row className="clearfix ">
            <Col sm={7}>
              <p><b>{props.data.bold}</b></p>
              <p>{props.data.summary}</p>
            </Col>
            <Col sm={5}>
              <img src={props.data.image}/>
            </Col>
          </Row>
        </Row>
      }
      <div className="text-center">
        {editButton}
      </div>
    </div>
  );
};
export default Nancy;

Nancy.propTypes = {
  data: PropTypes.object.isRequired,
  admin: PropTypes.object.isRequired,
  selectEdit: PropTypes.func.isRequired
}
