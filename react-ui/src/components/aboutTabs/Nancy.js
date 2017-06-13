import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Button } from 'react-bootstrap';
import EditModal from '../modals/EditModal';

const Nancy = (props) => {
  const editButton = (props.admin.admin) ?
    <Button bsStyle="info" onClick={() => props.selectEdit({data:props.data, section:"authors"})}>
      Edit
    </Button> :
    <div></div>;

  return (
    <div className="main-content">
      <Row className="clearfix content">
        <Col sm={8}>
          {(props.data === undefined) ?
            <div>Loading</div> :
            <div className="about">
              <h3>{props.data.name}</h3>
              <p><b>{props.data.education}</b></p>
              <p>{props.data.summary}</p>
            </div>
          }
        </Col>
        <Col sm={4}>
          {(props.data === undefined) ? <div>Loading</div> : <img src={props.data.image}/>}
        </Col>
      </Row>
      {editButton}
    </div>
  );
};
export default Nancy;

Nancy.propTypes = {
  data: PropTypes.object.isRequired,
  admin: PropTypes.object.isRequired,
  selectEdit: PropTypes.func.isRequired
}
