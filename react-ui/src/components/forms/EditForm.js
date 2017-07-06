import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { Button, Form, FormControl, ControlLabel, FormGroup, Alert } from 'react-bootstrap';

const EditForm = (props) => {

  const alert = (props.message.error) ?
    <Alert className="content text-center alertMessage" bsStyle="warning">{props.message.error}</Alert> :
    <div></div>;

  const buttons = (props.admin) ?
    <div>
      <Button className="edit" bsStyle="primary" type="submit">
        Submit
      </Button>
      <Button className="edit" bsStyle="danger" onClick={props.pop}>
        Cancel
      </Button>
    </div> :
    <div>
      <Button className="edit" bsStyle="info">
        <NavLink className="select" to="/login" onClick={props.pop}>
          Login Again
        </NavLink>
      </Button>
      <Button className="edit" bsStyle="danger" onClick={props.pop}>
        Cancel
      </Button>
    </div>

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
    <Form className="content" onSubmit={props.send}>
      {formItems}
      <div className="text-center">
        {alert}
        {buttons}
      </div>
    </Form>
  );
}


export default EditForm;

EditForm.propTypes = {
  formChange: PropTypes.func.isRequired,
  pop: PropTypes.func.isRequired,
  submit: PropTypes.func.isRequired,
  edit: PropTypes.object.isRequired,
  message: PropTypes.object.isRequired
};
