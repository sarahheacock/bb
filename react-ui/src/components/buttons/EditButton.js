import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import { initialPage } from '../data/options';

const EditButton = (props) => {
  return (
    <div className="text-center">
      {
        (props.admin) ?
          <Button bsStyle="info" onClick={() => props.updateState({
            page: {
              ...initialPage,
              page: props.pageSection,
              modalVisible: {
                ...initialPage.modalVisible,
                edit: true
              },
              edit: props.dataObj
            }
          })}>
            Edit
          </Button> :
          <div></div>
      }
    </div>
  );
}


export default EditButton;

EditButton.propTypes = {
  admin: PropTypes.bool.isRequired,
  updateState: PropTypes.func.isRequired,
  pageSection: PropTypes.string.isRequired,
  dataObj: PropTypes.object.isRequired
};
