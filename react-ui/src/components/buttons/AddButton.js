import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import { initialPage } from '../data/options';

const AddButton = (props) => {
  let input = {};

  if(Object.keys(props.dataObj).length > 0){
    Object.keys(props.dataObj).forEach((k) => {
      input[k] = '';
    });
  }

  return (
    <div className="text-center">
      {
        (props.admin) ?
          <Button bsStyle="primary" onClick={() => props.updateState({
            page: {
              ...initialPage,
              page: props.pageSection,
              modalVisible: {
                ...initialPage.modalVisible,
                add: true
              },
              edit: input
            }
          })}>
            Add
          </Button> :
          <div></div>
      }
    </div>
  );
}


export default AddButton;

AddButton.propTypes = {
  admin: PropTypes.bool.isRequired,
  updateState: PropTypes.func.isRequired,
  pageSection: PropTypes.string.isRequired,
  dataObj: PropTypes.object.isRequired
};
