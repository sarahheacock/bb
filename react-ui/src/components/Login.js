import React from 'react';
import PropTypes from 'prop-types';
import { PageHeader, Button, Form, FormControl, ControlLabel, FormGroup, Alert, Checkbox } from 'react-bootstrap';
import SignUpModal from './modals/SignUpModal';


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
    //if there is an errorMessage, give errorMessage
    //if there is no errorMessage and username is not undefined, welcome
    const alert = (Object.keys(this.props.errorMessage).length !== 0) ?
      <Alert className="content text-center alertMessage" bsStyle="warning">{this.props.errorMessage.error}</Alert> :
      (this.props.admin.username) ?
        <Alert className="content text-center alertMessage" bsStyle="success">{`Welcome, ${this.props.admin.username}`}</Alert>:
        <div></div>;

    const logoutButton = (this.props.admin.username) ?
      <Button bsStyle="primary" onClick={() => this.props.logout("You are logged out.")}>
        Logout
      </Button>:
      <div></div>;

    const loginButton = (this.props.admin.username) ?
      <div></div>:
      <div>
        <Button bsStyle="primary" type="submit">
          Login
        </Button>
        <Button onClick={(e) => {
          this.props.makeModal({
            ...this.props.modalVisible,
            client: true
          })
        }}>
          Sign Up
        </Button>
      </div>;


    return (
      <div className="main-content">
        <PageHeader>Admin Login</PageHeader>
        <Form className="content alertMessage" onSubmit={this.verify}>

          <FormGroup controlId="formInlineName">
            <ControlLabel>Username *</ControlLabel>
            <FormControl name="username" type="text" value={this.state.username} onChange={this.onFormChange} required/>
          </FormGroup>

          <FormGroup controlId="formInlineEmail">
            <ControlLabel>Password *</ControlLabel>
            <FormControl name="password" type="password" value={this.state.password} onChange={this.onFormChange} required/>
          </FormGroup>

          <Checkbox className="text-center" value={this.state.admin} onChange={this.onCheckboxChange}>
            Admin
          </Checkbox>

          {alert}
          <div className="text-center">
            {logoutButton}
            {loginButton}

          </div>
        </Form>

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
