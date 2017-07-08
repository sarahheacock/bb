import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { initialPage, initialMessage } from '../data/options';

import AlertMessage from './AlertMessage';

class LoginButtonSet extends React.Component {
  static propTypes = {
    postData: PropTypes.func.isRequired,
    message: PropTypes.object.isRequired,
    next: PropTypes.string.isRequired,
    updateState: PropTypes.func.isRequired,
    url: PropTypes.string.isRequired,
    formItems: PropTypes.object.isRequired
  }

  signUp = (e) => {
    this.props.updateState({
      page: {
        ...initialPage,
        edit: true,
      },
      message: {
        ...initialMessage
      }
    });
  }

  login = (e) => {
    this.props.postData(this.props.url, this.props.formItems)
  }

  render(){

    return (
      <div className="text-center">
        <AlertMessage
          message={this.props.message}
        />
        <NavLink className="select" to={this.props.next} onClick={this.login}>
          <Button bsStyle="primary">
            Login
          </Button>
        </NavLink>
        <Button onClick={this.signUp} className="edit">
          Sign Up
        </Button>
      </div>
    );
  }
}


export default LoginButtonSet;
