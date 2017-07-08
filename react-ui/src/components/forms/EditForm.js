import React from 'react';
import PropTypes from 'prop-types';
import { Button, Form, FormControl, ControlLabel, FormGroup } from 'react-bootstrap';

import SubmitButtonSet from '../buttons/SubmitButtonSet';

const EditForm = (props) => {

  const formItems = (Object.keys(props.edit).length < 1) ?
    <div></div>:
    (Object.keys(props.edit)).map((k, index) => {
      //let value =
      if(k !== "_id" && k !== "modalTitle" && k !== "length") {
        return (
          <FormGroup key={`formgroup${index}`}>
            <ControlLabel>{k}</ControlLabel>
            <FormControl componentClass="Textarea"
              name={k}
              type="text"
              value={
                Array.isArray(props.edit[k]) ?
                props.edit[k].toString() :
                props.edit[k]
              }
              onChange={props.formChange}
            />
          </FormGroup>
        );
      }
    });

//console.log("form", props.edit);

  let results = {};
  Object.keys(props.edit).forEach((key) => {
    if(key === "_id") results.token = props.token;
    //else if (key === "modalTitle" && props.edit.modalTitle === "Delete Content") results.length = props.dataLength
    else if(key !== "modalTitle" && key !== "length") results[key] = props.edit[key];
  });

  return (
    <Form className="content">
      {
        (props.edit.modalTitle === "Delete Content") ?
          <div className="text-center">Are you sure you want to delete this content?</div>:
          <div>{formItems}</div>
      }
      <div className="text-center">
        <SubmitButtonSet
          url={props.url}
          editData={props.editData}
          message={props.message}
          next={props.next}
          token={props.token}
          updateState={props.updateState}
          formItems={results}
          title={props.edit.modalTitle}
          length={props.edit.length}
        />
      </div>
    </Form>
  );
}


export default EditForm;

EditForm.propTypes = {
  formChange: PropTypes.func.isRequired,
  //pop: PropTypes.func.isRequired,
  editData: PropTypes.func.isRequired,
  updateState: PropTypes.func.isRequired,
  edit: PropTypes.object.isRequired,
  message: PropTypes.object.isRequired,
  token: PropTypes.string.isRequired,
  next: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  //dataLength: PropTypes.number.isRequired
  //page: PropTypes.object.isRequired
};
