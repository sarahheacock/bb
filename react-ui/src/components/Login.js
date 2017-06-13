import React from 'react';
import PropTypes from 'prop-types';
import { PageHeader, Button, Form, FormControl, ControlLabel, FormGroup, Alert } from 'react-bootstrap';

class Login extends React.Component {
  static propTypes = {
    verifyEmail: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired,
    errorMessage: PropTypes.object.isRequired,
    admin: PropTypes.object.isRequired
  }

  constructor(props){
    super(props);
    this.state = {
      username: '',
      password: ''
    };
  }

  onFormChange = (e) => {
    this.state[e.target.name] = e.target.value;
    this.setState(this.state);
  }

  verify = (e) => {
    if(e) e.preventDefault();
    this.props.verifyEmail({username: this.state.username, password: this.state.password});
    this.state.username = '';
    this.state.password = '';
    this.setState(this.state);
  }

  render(){
    const alert = (Object.keys(this.props.errorMessage).length !== 0) ?
      <Alert className="content text-center alertMessage" bsStyle="warning">{this.props.errorMessage.error}</Alert> :
      (this.props.admin.admin) ?
        <Alert className="content text-center alertMessage" bsStyle="success">"Welcome, Nancy"</Alert>:
        <div></div>;

    const logoutButton = (this.props.admin.admin) ?
      <Button bsStyle="primary" onClick={() => this.props.logout("You are logged out.")}>
        Logout
      </Button>:
      <div></div>;

    const loginButton = (this.props.admin.admin) ?
      <div></div>:
      <Button bsStyle="primary" type="submit">
        Login
      </Button>;

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

          {alert}
          <div className="text-center">
            {logoutButton}
            {loginButton}
          </div>
        </Form>

      </div>
    );
  }
}

export default Login;
