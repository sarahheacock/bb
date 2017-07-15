import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { initialPage, initialMessage, initialEdit, initialCheckout } from '../data/options';

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
    //length: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
  }



  pop = (e) => {
    this.props.updateState({
      page: {
        ...initialPage
      },
      edit: {
        ...initialEdit
      },
      message: {
        ...initialMessage
      }
    });
  }


  submit = (e) => {

    const valid = Object.keys(this.props.formItems).reduce((a, b) => {
      const test = (this.props.formItems[b] !== true && this.props.formItems[b] !== false) ?
        this.props.formItems[b][0]:
        this.props.formItems[b];
      //console.log("test", test);
      return (a && test !== "" && test !== undefined);
    }, true);


    //if editing page
    //`/api/admin/${blogID}/page/${this.props.section}/${this.props.dataObj._id}`
    if(valid && this.props.title === "Delete Content"){
      //if(!this.props.message.error){
        this.props.editData(this.props.url);
      //}
      // else {
      //   this.props.updateState({
      //     message: {
      //       error: "You cannot delete all entries. Deleting all entries will cause errors",
      //       success: ''
      //     }
      //   });
      // }
    }
    else if (valid && this.props.title === "Sign Up"){
      const result = {
        email: this.props.formItems.email,
        password: this.props.formItems.password,
        billing: `${this.props.formItems["Address Line 1"]}/${this.props.formItems["Address Line 2"]}/${this.props.formItems.city}/${this.props.formItems.state}/${this.props.formItems.zip}/${this.props.formItems.country}`
      }
      //console.log("result", result);
      const passwordValid = (this.props.formItems["verify Password"]) ?
        this.props.formItems["verify Password"] === this.props.formItems["password"] :
        true;

      if(passwordValid){
        this.props.editData(this.props.url, result);
      }
      else {
        e.preventDefault();
        this.props.updateState({
          message: {
            ...initialMessage,
            error: "Passwords must match"
          }
        });
      }
    }
    else if (valid && this.props.title === "Edit Billing"){
      const result = {
        email: this.props.formItems.email,
        billing: `${this.props.formItems["Address Line 1"]}/${this.props.formItems["Address Line 2"]}/${this.props.formItems.city}/${this.props.formItems.state}/${this.props.formItems.zip}/${this.props.formItems.country}`
      }
      //console.log("result", result);
      this.props.editData(this.props.url, result);
    }
    else if (valid && this.props.title === "Edit Payment"){
      const result = {
        credit: {
          name: this.props.formItems["Name on Card"],
          number: this.props.formItems.number
        }
      }

      const d = new Date();
      const currentYear = d.getFullYear();
      const currentMonth = d.getMonth() + 1;

      const month = this.props.formItems["Expiration Month"].split(' ');
      const expMonth = parseInt(month[1]);
      const expYear = parseInt(this.props.formItems["Expiration Year"]);

      //if expiration date is valid
      if(expYear > currentYear || expMonth > currentMonth){
        this.props.editData(this.props.url, result);
        //this.props.updateState({checkout:})
      }
      else {
        e.preventDefault();
        this.props.updateState({
          message: {
            ...initialMessage,
            error: "Invalid Expiration Date"
          }
        });
      }

    }
    else if (valid){
      this.props.editData(this.props.url, this.props.formItems);
    }
    else {
      e.preventDefault();
      this.props.updateState({
        message: {
          ...initialMessage,
          error: "Fill out required fields"
        }
      });
    }
  }


  render(){
    const submitButton = (this.props.title === "Delete Content") ?
        ((this.props.message.error) ?
          <div></div>:
          <Button className="edit" bsStyle="danger">
            Delete
          </Button>) :
        ((this.props.title === "Cancel Reservation") ?
          <Button className="edit" bsStyle="danger">
            Cancel Reservation
          </Button> :
          <Button className="edit" bsStyle="primary">
            {this.props.title}
          </Button>
        );
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
              <NavLink className="select" to="/login" onClick={this.pop}>
                <Button className="edit" bsStyle="info">
                  Login Again
                </Button>
              </NavLink>
              <Button className="edit" onClick={this.pop}>
                Cancel
              </Button>
            </div>
        }
      </div>
    );
  }
}


export default SubmitButtonSet;
