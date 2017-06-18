import React from 'react';
import PropTypes from 'prop-types';
import { PageHeader, Button, Form, FormControl, ControlLabel, FormGroup, Alert, Checkbox } from 'react-bootstrap';
import LoginForm from './forms/LoginForm';
import SignUpModal from './modals/SignUpModal';
import { NavLink } from 'react-router-dom';


//this.props.admin.username === undefined determines layout
class Login extends React.Component {
  static propTypes = {
    verifyEmail: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired,
    errorMessage: PropTypes.object.isRequired,
    admin: PropTypes.object.isRequired,
    createEmail: PropTypes.func.isRequired,
    modalVisible: PropTypes.object.isRequired,
    makeModal: PropTypes.func.isRequired,
    checkoutSelected: PropTypes.bool.isRequired
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
    if(e) e.preventDefault();
    this.props.verifyEmail({username: this.state.username, password: this.state.password, admin: this.state.admin});
    this.state.username = '';
    this.state.password = '';
    this.setState(this.state);
  }

  render(){
    console.log("checkoutSelected", this.props.checkoutSelected);
    //if there is an errorMessage, give errorMessage
    //if there is no errorMessage and username is not undefined, welcome
    const alert = (Object.keys(this.props.errorMessage).length !== 0) ?
      <Alert className="content text-center alertMessage" bsStyle="warning">{this.props.errorMessage.error}</Alert> :
      (this.props.admin.username) ?
        <Alert className="content text-center alertMessage" bsStyle="success">{`Welcome, ${this.props.admin.username}`}</Alert>:
        <div></div>;

    const logoutButton = (!this.props.admin.username) ?
      <div></div>:
      (this.props.modalVisible.login) ?
        <NavLink className="select" to="/book-now/billing" onClick={(e) => this.props.makeModal({
          login: false
        })}>
          <Button>
            Continue
          </Button>
        </NavLink> :
        <Button bsStyle="primary" onClick={() => this.props.logout("You are logged out.")}>
          Logout
        </Button>;

    const button = <Button bsStyle="primary" onClick={this.verify}>
      Login
    </Button>;

    const loginButton = (this.props.admin.username) ?
      <div></div>:
      <div>
        {button}
        <Button onClick={(e) => {
          this.props.makeModal({
            client: true
          })
        }}>
          Sign Up
        </Button>
      </div>;


    return (
      <div className="main-content">
        <PageHeader>Login</PageHeader>

        <LoginForm
          passwordValue={this.state.password}
          usernameValue={this.state.username}
          adminValue={this.state.admin}
          formChange={this.onFormChange}
          checkboxChange={this.onCheckboxChange}
        />

        <div className="text-center">
          {alert}
          {logoutButton}
          {loginButton}
        </div>

        <SignUpModal
          makeModal={this.props.makeModal}
          modalVisible={this.props.modalVisible}
          createEmail={this.props.createEmail}
          errorMessage={this.props.errorMessage}
          admin={this.props.admin}
          checkoutSelected={this.props.checkoutSelected}
        />


      </div>
    );
  }
}

export default Login;
