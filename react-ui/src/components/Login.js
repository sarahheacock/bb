import React from 'react';
import PropTypes from 'prop-types';
import { PageHeader, Button, Form, FormControl, ControlLabel, FormGroup, Alert, Checkbox } from 'react-bootstrap';
import LoginForm from './forms/LoginForm';
import SignUpModal from './modals/SignUpModal';
import { NavLink } from 'react-router-dom';


class Login extends React.Component {
  static propTypes = {
    modalEdit: PropTypes.bool.isRequired,
    data: PropTypes.array.isRequired,
    user: PropTypes.object.isRequired,
    message: PropTypes.object.isRequired,
    postData: PropTypes.func.isRequired,
    updateState: PropTypes.func.isRequired,
    roomID: PropTypes.object.isRequired,
  }

  constructor(props){
    super(props);
    this.state = {
      username: '',
      password: '',
      admin: false
    };
  }

  onFormChange = (e) => {
    this.state[e.target.name] = e.target.value;
    this.setState(this.state);
  }

  onCheckboxChange = (e) => {
    //const current = this.state.admin;
    this.state.admin = !this.state.admin;
    this.setState(this.state);
  }

  // verify = (e) => {
  //   //if(e) e.preventDefault();
  //   //this.props.verifyEmail({username: this.state.username, password: this.state.password, admin: this.state.admin});
  //   if(this.state.admin) {
  //     this.props.postData('/api/login', {
  //       username: this.state.username,
  //       password: this.state.password
  //     });
  //   }
  //   else {
  //     this.props.postData('/locked/userlogin', {
  //       email: this.state.username,
  //       password: this.state.password
  //     });
  //   }
  //
  //   this.state.username = '';
  //   this.state.password = '';
  //   this.setState(this.state);
  // }

  render(){

    return (
      <div className="main-content">
        <PageHeader>Login</PageHeader>

        <LoginForm
          passwordValue={this.state.password}
          usernameValue={this.state.username}
          adminValue={this.state.admin}

          formChange={this.onFormChange}
          checkboxChange={this.onCheckboxChange}

          postData={this.props.postData}
          message={this.props.message}
          updateState={this.props.updateState}
          next={(Object.keys(this.props.roomID).length === 0) ? "#" : "/book-now/billing"}
        />

        <SignUpModal
          user={this.props.user}
          editData={this.props.postData}
          updateState={this.props.updateState}
          roomID={this.props.roomID}
          message={this.props.message}
          modalEdit={this.props.modalEdit}
          url='/page/user-setup'
          title="Sign Up"
          dataObj={ {
           email: '',
           password: '',
           billing: {
             line1: '',
             line2: '',
             city: '',
             state: '',
             zip: '',
             country: 'United States'
           }
         } }
        />

      </div>
    );
  }
}

export default Login;

// <SignUpModal
//   makeModal={this.props.makeModal}
//   modalVisible={this.props.modalVisible}
//   createEmail={this.props.createEmail}
//   errorMessage={this.props.errorMessage}
//   admin={this.props.admin}
//   checkoutSelected={this.props.checkoutSelected}
// />

// <div className="text-center">
//   {alert}
//   {logoutButton}
//   {loginButton}
// </div>
