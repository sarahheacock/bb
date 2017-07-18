import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { initialMessage, initialEdit, initialCheckout, initialUser } from '../data/options';

import AlertMessage from './AlertMessage';
import EditButton from './EditButton';
//import ContinueButton from './ContinueButton';

//SUBMIT ADMIN EDITTING, USER PROFILE EDIT, CREATE USER, RESERVE, AND CANCEL RESERVATION
//THIS IS WHERE ERROR HANDLING FOR USER AUTH, FORMS, PRE-EXISTING DATA HAPPENS
class SubmitButtonSet extends React.Component {
  static propTypes = {
    editData: PropTypes.func.isRequired,
    updateState: PropTypes.func.isRequired,

    url: PropTypes.string.isRequired,
    next: PropTypes.string.isRequired,
    message: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,

    formItems: PropTypes.object.isRequired,
    title: PropTypes.string.isRequired
  }



  pop = (e) => {
    this.props.updateState({
      edit: initialEdit,
      message: initialMessage
    });
  }

  logout = (e) => {
    this.props.updateState({
      edit: initialEdit,
      message: initialMessage,
      user: initialUser,
      checkout: initialCheckout
    });
  }


  submit = (e) => {
    if(this.props.message.error === ""){ //if there is no error with the forms
      if(this.props.title === "Delete Content") this.props.editData(this.props.url);
      else this.props.editData(this.props.url, this.props.formItems);
    }
    else {
      e.preventDefault();//prevent navLink
      this.props.updateState({message: this.props.message});
    }
  }


  render(){
    const submitButton = (this.props.title === "Delete Content") ?
        ((this.props.message.error) ?
          <div></div>:
          <Button className="edit" bsStyle="danger">
            Delete
          </Button>) :

        <Button className="edit" bsStyle="primary">
          {this.props.title}
        </Button>;

    const cancelButton = (this.props.title === "Login") ?
        <EditButton
          user={this.props.user}
          updateState={this.props.updateState}
          dataObj={{}}
          title="Sign Up"
          pageSection={(this.props.next === "/welcome") ? "login" : "availability"}
          length={2}
        /> :
        <Button className="edit" onClick={this.pop}>
          Cancel
        </Button>;

    console.log("formItems", this.props.formItems);

    return (
      <div className="text-center">
        <AlertMessage
          message={this.props.message}
        />
        {
          (this.props.message.error !== "Session expired. Log back in again to continue.") ?
            <div>
              <NavLink className="select" to={this.props.next} onClick={this.submit}>
                {submitButton}
              </NavLink>
              {cancelButton}
            </div> :
            <div>
              <EditButton
                user={this.props.user}
                updateState={this.props.updateState}
                dataObj={{}}
                title="Login"
                pageSection={""}
                length={2}
              />
              <Button className="edit" onClick={this.logout}>
                Cancel
              </Button>
            </div>
        }
      </div>
    );
  }
}


export default SubmitButtonSet;
