import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect, NavLink } from 'react-router-dom';
import { Button, Col, Row, Modal, Alert } from 'react-bootstrap';
import SignUpForm from '../forms/SignUpForm';


class Billing extends React.Component {
  static propTypes = {
    makeModal: PropTypes.func.isRequired,
    updateCheckout: PropTypes.func.isRequired,
    checkout: PropTypes.object.isRequired,
    select: PropTypes.object.isRequired,
    fetchClient: PropTypes.func.isRequired,
    admin: PropTypes.object.isRequired,
    data: PropTypes.array.isRequired,
    modalVisible: PropTypes.object.isRequired
  }

  constructor(props){
    super(props);
      this.state = {
       email: '',
       billing: {
         line1: '',
         line2: '',
         city: '',
         state: '',
         zip: '',
         country: ''
       }
    }
  }

  componentDidMount() {
    //this.props.makeModal({login: false});
    this.props.fetchClient(this.props.admin);
  }

  componentDidUpdate() {
    if(this.props.data[0] !== undefined){
      if(this.props.data[0]["billing"] !== undefined && this.state.billing.line1===''){
        const arr = (this.props.data[0]===undefined) ?
          []:
          (this.props.data[0]["billing"]) ?
            this.props.data[0]["billing"].split('/') :
            [];

        if(arr.length >= 6){
          this.state = {
             email: this.props.data.email,
             billing: {
               line1: arr[0],
               line2: arr[1],
               city: arr[2],
               state: arr[3],
               zip: arr[4],
               country: arr[5]
             }
           }
        }
        else if(arr.length === 5){
          this.state = {
             email: this.props.data.email,
             billing: {
               line1: arr[0],
               line2: arr[1],
               city: arr[2],
               state: arr[3],
               zip: arr[4],
               country: arr[5]
             }
           }
        }

        this.setState(this.state);
      }
    }
  }

  handleContinue = () => {
    this.props.updateCheckout(
      {
        ...this.props.select
      },
      {
        ...this.props.checkout,
        "billing": true
      }
    );
  }

  handleBack = () => {
    this.props.updateCheckout(
      {
        ...this.props.select
      },
      {
        ...this.props.checkout,
        "selected": false
      }
    );
  }

  onFormChange = (e) => {
    this.state[e.target.name] = e.target.value;
    this.setState(this.state);
  }

  onAddressChange = (e) => {
    this.state["billing"][e.target.name] = e.target.value;
    this.setState(this.state);
  }

  pop = (e) => {
    if(e) e.preventDefault();
    this.props.makeModal({
      "client": false,
      "login": false
    });
  }

  render() {
    console.log("state", this.state)
    // const alert = (Object.keys(this.props.errorMessage).length !== 0) ?
    //   <Alert className="content text-center alertMessage" bsStyle="warning">{this.props.errorMessage.error}</Alert> :
    //   (this.props.admin.username) ?
    //     <Alert className="content text-center alertMessage" bsStyle="success">{`Welcome, ${this.props.admin.username}`}</Alert>:
    //     <div></div>;


    const submitButton = <button className="btn btn-primary" onClick={this.verify} onClick={() => {
        this.props.updateEmail({
          password: this.state.password,
          email: this.state.email,
          billing: `${this.state.billing.line1}/${this.state.billing.line2}/${this.state.billing.city}/${this.state.billing.state}/${this.state.billing.zip}/${this.state.billing.country}`
        });

        this.props.makeModal({
          client: false,
          login: false
        });
      }}>
        Submit
    </button>;

    const continueButton = <NavLink to="/book-now/payment" onClick={this.handleContinue}>
      <Button bsStyle="primary">
        Continue
      </Button>
    </NavLink>;


    const client = (this.props.data[0]) ?
      <div>
        <h3>{this.props.data[0]["email"]}</h3>
        <p>{`${this.state.billing.line1} ${this.state.billing.line2}, ${this.state.billing.city}, ${this.state.billing.state} ${this.state.billing.zip} ${this.state.billing.country}`}</p>
      </div> :
      <div>Loading</div>


    const closeButton = <Button bsStyle="danger" onClick={this.pop}>
      Cancel
    </Button>;

    return (
      <div className="main-content not-found">
        <div className="well text-center">
          {client}
          <Button bsStyle="danger" onClick={() => this.props.makeModal({client: true})}>
            Edit
          </Button>
        </div>

        <div className="text-center">{continueButton}</div>

        <Modal show={this.props.modalVisible.client} >
          <Modal.Header>
            <Modal.Title>Sign Up</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <SignUpForm
              line1Value={this.state.billing.line1}
              line2Value={this.state.billing.line2}
              cityValue={this.state.billing.city}
              stateValue={this.state.billing.state}
              zipValue={this.state.billing.zip}
              countryValue={this.state.billing.country}
              addressChange={this.onAddressChange}
            />
          </Modal.Body>
          <Modal.Footer>
            <div className="text-center">

              {submitButton}{closeButton}
            </div>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}


export default Billing;

// <div className="well">
//   <div className="text-center">{editRoomButton}</div>
//   <Row className="clearfix">
//     <Col className="text-center" sm={7}>
//       <h3>{this.props.select.roomID.title}</h3>
//       <p>{this.props.select.roomID.cost}</p>
//     </Col>
//     <Col className="text-center" sm={5}>
//       <img src={this.props.select.roomID.image}/>
//     </Col>
//   </Row>
// </div>

// const editRoomButton = <NavLink to="/book-now/availability" onClick={this.handleBack}>
//   <Button bsStyle="danger">
//     Edit
//   </Button>
// </NavLink>
