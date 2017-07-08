import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { initialPage, initialMessage } from '../data/options';

import AlertMessage from './AlertMessage';

class SubmitButtonSet extends React.Component {
  static propTypes = {
    message: PropTypes.object.isRequired,
    next: PropTypes.string.isRequired,
    updateState: PropTypes.func.isRequired,
    editData: PropTypes.func.isRequired,
    //token: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    formItems: PropTypes.object.isRequired,
    length: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
  }



  pop = (e) => {
    this.props.updateState({
      page: {
        ...initialPage
      },
      message: {
        ...initialMessage
      }
    });
  }

  submit = (e) => {
    const valid = Object.keys(this.props.formItems).reduce((a, b) => {
      return (a && this.props.formItems[b] !== "");
    }, true);
    console.log("valid", valid);


    //if editing page
    //`/api/admin/${blogID}/page/${this.props.section}/${this.props.dataObj._id}`
    if(valid && (this.props.url.includes('api') || this.props.url.includes('user-setup'))){
      if(this.props.title === "Delete Content"){
        if(this.props.length > 1 ){
          this.props.editData(this.props.url);
        }
        else {
          this.props.updateState({
            message: {
              error: "You cannot delete all entries. Deleting all entries will cause errors",
              success: ''
            }
          });
        }
      }
      else {
        this.props.editData(this.props.url, this.props.formItems);
      }
    }
    // else if(valid && this.props.url.includes('user-setup')){ //if logging in
    //   this.props.editData(this.props.url, this.props.formItems);
    // }
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
    let submitButton = <div></div>;
    if(this.props.formItems){
      submitButton = (this.props.title === "Delete Content") ?
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
            Submit
          </Button>
        );
    }

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
              <Button className="edit" onClick={this.pop}>
                Cancel
              </Button>
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
