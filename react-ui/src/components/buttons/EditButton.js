import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import { initialPage } from '../data/options';

const EditButton = (props) => {
  const style = (props.title === "Edit") ?
    "info":
    ((props.title === "Add") ?
      "primary":
      ((props.title === "Delete") ?
        "danger":
        "default"));

  let result = {};
  Object.keys(props.name).forEach((key) => {
    if(props.title === "Add") result[key] = '';
    else if(props.title === "Delete" && key !== "_id") ;
    else result[key] = props.name[key];
  });

  return (
    <div className="text-center">
      {
        (props.admin) ?
          <Button bsStyle={style} onClick={ (e) => {
            props.handleSelect(e);
            props.updateState({
              page: {
                ...initialPage,
                modalVisible: {
                  ...initialPage.modalVisible,
                  edit: true
                }
              }
            });
          }} name={JSON.stringify(result)} value={props.title}>
            {props.title}
          </Button> :
          <div></div>
      }
    </div>
  );
}


export default EditButton;

EditButton.propTypes = {
  admin: PropTypes.bool.isRequired,
  handleSelect: PropTypes.func.isRequired,
  name: PropTypes.object.isRequired,
  updateState: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired
  //pageSection: PropTypes.string.isRequired,
  //dataObj: PropTypes.object.isRequired
};
