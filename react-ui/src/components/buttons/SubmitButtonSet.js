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
    onSubmit: PropTypes.func.isRequired,
    token: PropTypes.string.isRequired,
    formItems: PropTypes.object.isRequired
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
      return (a && this.props.formItems[b] !== undefined);
    }, true);

    if(valid){
      this.props.onSubmit;
      if(this.props.message.success){
        this.props.updateState({
          page: {
            ...initialPage
          },
          message: {
            ...initialMessage
          }
        });
      }
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

    return (
      <div className="text-center">
        <AlertMessage
          message={this.props.message}
        />
        {
          (this.props.token) ?
            <div>
              <NavLink className="select" to={`/${this.props.next}`} onClick={this.submit}>
                <Button className="edit" bsStyle="info">
                  Submit
                </Button>
              </NavLink>
              <Button className="edit" bsStyle="danger" onClick={this.pop}>
                Cancel
              </Button>
            </div> :
            <div>
              <NavLink className="select" to="/login" onClick={this.pop}>
                <Button className="edit" bsStyle="info">
                  Login Again
                </Button>
              </NavLink>
              <Button className="edit" bsStyle="danger" onClick={this.pop}>
                Cancel
              </Button>
            </div>
        }
      </div>
    );
  }
}


export default SubmitButtonSet;
