import React from 'react';
import PropTypes from 'prop-types';
import { Button, Form, FormControl, ControlLabel, FormGroup } from 'react-bootstrap';

import SubmitButtonSet from '../buttons/SubmitButtonSet';

const EditForm = (props) => {

  const formItems = (Object.keys(props.edit).length < 1) ?
    <div></div>:
    (Object.keys(props.edit)).map((k, index) => {
      //let value =
      if(k !== "_id") {
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

  return (
    <Form className="content">
      {formItems}
      <div className="text-center">
        <SubmitButtonSet
          submit={props.onSubmit}
          message={props.message}
          next={props.page.page}
          token={props.token}
          updateState={props.updateState}
          formItems={props.edit}
        />
      </div>
    </Form>
  );
}


export default EditForm;

EditForm.propTypes = {
  formChange: PropTypes.func.isRequired,
  //pop: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  updateState: PropTypes.func.isRequired,
  edit: PropTypes.object.isRequired,
  message: PropTypes.object.isRequired,
  token: PropTypes.string.isRequired,
  //page: PropTypes.object.isRequired
};
