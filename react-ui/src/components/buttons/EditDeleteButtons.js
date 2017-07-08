import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import { blogID, initialPage } from '../data/options';

const DeleteButton = (props) => {
  return (
    <div className="text-center">
      {
        (props.user.admin) ?
          <div>
            <Button bsStyle="info" className="edit" onClick={ (e) => {
              props.handleClick(e);
              props.updateState({
                page: {
                  ...initialPage,
                  modalVisible: {
                    ...initialPage.modalVisible,
                    edit: true
                  }
                }
              });
            }} name={props.name}>
              Edit
            </Button>
            <Button name={props.name} className="edit" bsStyle="danger" onClick={ (e) => {
              props.handleClick(e);
              props.updateState({
                page: {
                  ...initialPage,
                  modalVisible: {
                    ...initialPage.modalVisible,
                    edit: true
                  }
                }
              });
            }}>
              Delete
            </Button>
          </div> :
          <div></div>
      }
    </div>
  );
}


export default DeleteButton;

DeleteButton.propTypes = {
  user: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired,
  updateState: PropTypes.func.isRequired
  // deleteData: PropTypes.func.isRequired,
  // pageSection: PropTypes.string.isRequired,
  // dataObjID: PropTypes.string.isRequired,
  // length: PropTypes.number.isRequired
};
