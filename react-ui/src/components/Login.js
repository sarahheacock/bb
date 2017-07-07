import React from 'react';
import PropTypes from 'prop-types';
import { PageHeader, Button, Form, FormControl, ControlLabel, FormGroup, Alert, Checkbox } from 'react-bootstrap';
import LoginForm from './forms/LoginForm';
import SignUpModal from './modals/SignUpModal';
import { NavLink } from 'react-router-dom';


//this.props.admin.username === undefined determines layout
class Login extends React.Component {
  static propTypes = {
    page: PropTypes.object.isRequired,
    data: PropTypes.array.isRequired,
    user: PropTypes.object.isRequired,
    message: PropTypes.object.isRequired,
    postData: PropTypes.func.isRequired,
    updateState: PropTypes.func.isRequired,
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

  verify = (e) => {
    //if(e) e.preventDefault();
    //this.props.verifyEmail({username: this.state.username, password: this.state.password, admin: this.state.admin});
    if(this.state.admin) {
      this.props.postData('/api/login', {
        username: this.state.username,
        password: this.state.password
      });
    }
    else {
      this.props.postData('/locked/userlogin', {
        email: this.state.username,
        password: this.state.password
      });
    }

    this.state.username = '';
    this.state.password = '';
    this.setState(this.state);
  }

  render(){
    //no need to check if data is defined since there is not a componentDidMount()
    //if there is an errorMessage, give errorMessage
    //if there is no errorMessage and username is not undefined, welcome

    // const alert = (Object.keys(this.props.errorMessage).length !== 0) ?
    //   <Alert className="content text-center alertMessage" bsStyle="warning">{this.props.errorMessage.error}</Alert> :
    //   (this.props.admin.username) ?
    //     <Alert className="content text-center alertMessage" bsStyle="success">{`Welcome, ${this.props.admin.username}`}</Alert>:
    //     <div></div>;



    return (
      <div className="main-content">
        <PageHeader>Login</PageHeader>

        <LoginForm
          passwordValue={this.state.password}
          usernameValue={this.state.username}
          adminValue={this.state.admin}
          formChange={this.onFormChange}
          checkboxChange={this.onCheckboxChange}
          onSubmit={this.verify}
          message={this.props.message}
          updateState={this.props.updateState}
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
