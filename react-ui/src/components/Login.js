import React from 'react';
import PropTypes from 'prop-types';
import { PageHeader, Button, Form, FormControl, ControlLabel, FormGroup, Alert, Checkbox } from 'react-bootstrap';

import EditForm from './forms/EditForm';
//import SignUpModal from './modals/SignUpModal';
import { NavLink } from 'react-router-dom';


class Login extends React.Component {
  static propTypes = {
    data: PropTypes.array.isRequired,
    user: PropTypes.object.isRequired,
    message: PropTypes.object.isRequired,
    roomID: PropTypes.object.isRequired,

    getData: PropTypes.func.isRequired,
    postData: PropTypes.func.isRequired,
    updateState: PropTypes.func.isRequired
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
    if(e.target.name === "admin") this.state.admin = !this.state.admin;
    else this.state[e.target.name] = e.target.value;
    this.setState(this.state);
  }


  render(){

    console.log("state", this.state)
    return (
      <div className="main-content">
        <PageHeader>Login</PageHeader>

        <div className="content alertMessage">
          <EditForm
            formChange={this.onFormChange}
            editData={this.props.postData}
            updateState={this.props.updateState}

            message={this.props.message}
            dataObj={this.state}
            modalTitle="Login"
            length={2}

            user={this.props.user}
            next={(Object.keys(this.props.roomID).length === 0) ? "#" : "/book-now/billing"}
            url={(this.state.admin) ? '/api/login' : '/locked/userlogin'}
          />
        </div>

      </div>
    );
  }
}

export default Login;

// <SignUpModal
//   user={this.props.user}
//   editData={this.props.postData}
//   updateState={this.props.updateState}
//   roomID={this.props.roomID}
//   message={this.props.message}
//   modalEdit={this.props.modalEdit}
//   url='/page/user-setup'
//   title="Sign Up"
//   dataObj={ {
//    email: '',
//    password: '',
//    billing: {
//      line1: '',
//      line2: '',
//      city: '',
//      state: '',
//      zip: '',
//      country: 'United States'
//    }
//  } }
//
//


// <LoginForm
//   passwordValue={this.state.password}
//   usernameValue={this.state.username}
//   adminValue={this.state.admin}
//
//   formChange={this.onFormChange}
//   checkboxChange={this.onCheckboxChange}
//
//   postData={this.props.postData}
//   message={this.props.message}
//   updateState={this.props.updateState}
//   next={(Object.keys(this.props.roomID).length === 0) ? "#" : "/book-now/billing"}
// />
