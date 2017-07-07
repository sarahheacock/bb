import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import { initialPage, initialMessage } from '../data/options';

import AlertMessage from './AlertMessage';

class LoginButtonSet extends React.Component {
  static propTypes = {
    message: PropTypes.object.isRequired,
    updateState: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired
  }

  // pop = (e) => {
  //   this.props.updateState({
  //     page: {
  //       ...initialPage
  //     },
  //     message: {
  //       ...initialMessage
  //     }
  //   });
  // }


  componentDidUpdate() {
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

  signUp = (e) => {
    this.props.updateState({
      page: {
        ...initialPage,
        modalVisible: {
          ...initialPage.modalVisible,
          modalTwo: true
        }
      },
      message: {
        ...initialMessage
      }
    });
  }

  // submit = (e) => {
  //   console.log("click");
  //   this.props.onSubmit;
  // }

  render(){

    return (
      <div className="text-center">
        <AlertMessage
          message={this.props.message}
        />
        <Button bsStyle="primary" onClick={this.props.onSubmit}>
          Login
        </Button>
        <Button onClick={this.signUp}>
          Sign Up
        </Button>
      </div>
    );
  }
}


export default LoginButtonSet;
