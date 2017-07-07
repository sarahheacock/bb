import React from 'react';
import PropTypes from 'prop-types';
import { Alert } from 'react-bootstrap';

const AlertMessage = (props) => {
  return (
    <div className="text-center">
      {
        (props.message.error) ?
          <Alert className="content text-center alertMessage" bsStyle="warning">{props.message.error}</Alert> :
          (props.message.success) ?
            <Alert className="content text-center alertMessage" bsStyle="success">{props.message.success}</Alert> :
            <div></div>
      }
    </div>
  );
}


export default AlertMessage;

AlertMessage.propTypes = {
  message: PropTypes.object.isRequired
};
