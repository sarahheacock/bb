import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import { initialEdit, initialMessage } from '../data/options';

const EditButton = (props) => {
  const style = (props.title === "Edit") ?
    "info":
    ((props.title === "Add") ?
      "primary":
      ((props.title === "Delete") ?
        "danger":
        "default"));

  let result = {};
  Object.keys(props.dataObj).forEach((key) => {
    if(props.title === "Add" && key !== "_id") result[key] = '';
    else if((props.title === "Delete" || props.title === "Cancel Reservation") && key !== "_id") ;
    else result[key] = props.dataObj[key];
  });

  const modalTitle = (props.title === "Edit" || props.title === "Add" || props.title === "Delete") ?
    `${props.title} Content`:
    props.title;

  const button = (props.admin === false && (props.title === "Edit" || props.title === "Add" || props.title === "Delete")) ?
    <div></div> :
    <Button bsStyle={style} onClick={ (e) => {
      if(props.title === "Select Room"){

        props.updateState({
          edit: {
            ...initialEdit,
              modalTitle: "Login",
              length: 2,
              pageSection: "",
              dataObj: {
                username: '',
                password: '',
                admin: false
              }
          },
          message: initialMessage,
          checkout: result
        });
      }
      else if(props.title === "Continue"){

        props.updateState({
          ...props.dataObj,
          message: initialMessage,
        });
      }
      else {
        props.updateState({
          edit: {
            ...initialEdit,
            modalTitle: modalTitle,
            length: props.length,
            pageSection: props.pageSection,
            dataObj: result
          },
          message: initialMessage
        })
      }
    }} value={result} name={modalTitle}>
      {props.title}
    </Button>;

  return (
    button
  );
}


export default EditButton;

EditButton.propTypes = {
  admin: PropTypes.bool.isRequired,
  dataObj: PropTypes.object.isRequired,

  updateState: PropTypes.func.isRequired,

  title: PropTypes.string.isRequired,
  pageSection: PropTypes.string.isRequired,
  length: PropTypes.number.isRequired
};
