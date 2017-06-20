import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Button } from 'react-bootstrap';
import EditModal from '../modals/EditModal';

const Nancy = (props) => {
  let editButton = <div></div>;
  let title = <h3>Loading</h3>;
  let bold = <p><b>Loading</b></p>;
  let summary = <p>Loading</p>
  let image = <div>Loading</div>
  //make sure data is defined
  if(props.data){
    editButton = (props.admin.admin) ?
      <Button bsStyle="info" onClick={() => props.selectEdit({data:props.data, section:"about"})}>
        Edit
      </Button> :
      <div></div>;
    //make sure data is fetched
    title = (props.data.title) ? <h3>{props.data.title}</h3> : <h3>Loading</h3>;
    bold = (props.data.bold) ? <p><b>{props.data.bold}</b></p> : <p><b>Loading</b></p>;
    summary = (props.data.summary) ? <p>{props.data.summary}</p> : <p>Loading</p>
    image = (props.data.image) ? <img src={props.data.image}/> : <div>Loading</div>
  }

  return (
    <div className="main-content">

      <Row className="clearfix content">
        {title}
        <Row className="clearfix ">
          <Col sm={7}>
            {bold}
            {summary}
          </Col>
          <Col sm={5}>
            {image}
          </Col>
        </Row>
      </Row>

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
