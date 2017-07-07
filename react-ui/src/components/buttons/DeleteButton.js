import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import { blogID } from '../data/options';

const DeleteButton = (props) => {
  return (
    <div className="text-center">
      {
        (props.user.admin) ?
          <Button name={props.name} className="edit" bsStyle="danger" onClick={props.handleClick}>
            Delete
          </Button>:
          <div></div>
      }
    </div>
  );
}


export default DeleteButton;

DeleteButton.propTypes = {
  user: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired
  // deleteData: PropTypes.func.isRequired,
  // pageSection: PropTypes.string.isRequired,
  // dataObjID: PropTypes.string.isRequired,
  // length: PropTypes.number.isRequired
};
