import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect, NavLink } from 'react-router-dom';
import { Form, FormControl, ControlLabel, FormGroup, Button, Col, Row, Modal, Alert } from 'react-bootstrap';
import PayForm from '../forms/PayForm';
import PayValidForm from '../forms/PayValidForm';

//if there is no payment on file, add payment and checkout.payment === true. Confirm button will bring to next page.
//if there is payment on file, make sure cvv and exp date matches card on file
class Payment extends React.Component {
  static propTypes = {
    makeModal: PropTypes.func.isRequired,
    updateCheckout: PropTypes.func.isRequired,
    checkout: PropTypes.object.isRequired,
    select: PropTypes.object.isRequired,
    fetchClient: PropTypes.func.isRequired,
    admin: PropTypes.object.isRequired,
    data: PropTypes.array.isRequired,
    modalVisible: PropTypes.object.isRequired,
    errorMessage: PropTypes.object.isRequired,
    updateEmail: PropTypes.func.isRequired,
    verifyPayment: PropTypes.func.isRequired
  }

  constructor(props){
    super(props);
    const y = new Date().getFullYear().toString();
    this.state = {
      name: '',
      number: '',
      month: "Jan",
      year: y,
      cvv: ''
    }
  }

  componentDidMount() {
    this.props.fetchClient(`/locked/user/${this.props.admin.user}?token=${this.props.admin.id}`);
  }

  componentDidUpdate() {

    if(this.props.data[0]){
      if(this.props.data[0]["credit"] !== undefined && this.state.name === ''){
        if(this.props.data[0]["credit"]["name"] !== ""){
          this.state.name = this.props.data[0]["credit"]["name"];
          this.state.number = this.props.data[0]["credit"]["number"];
          this.setState(this.state);
        }
      }
    }
  }

  handleContinue = () => {
    if(this.state.cvv === ""){ //if using pre-existing payment, updateCheckout handled by this.verify
      this.props.makeModal({
        login: true
      });
    }
    else { //if using new payment
      this.props.updateCheckout(
        {
          ...this.props.select
        },
        {
          ...this.props.checkout,
          "payment": true
        }
      );
      if(this.state.cvv){
        this.props.makeModal({
          login: false
        });
      }
    }
  }

  handleBack = () => {
    this.props.updateCheckout(
      {
        ...this.props.select
      },
      {
        ...this.props.checkout,
        "confirmation": false
      }
    );
  }

  onFormChange = (e) => {
    this.state[e.target.name] = e.target.value;
    this.setState(this.state);
  }

  update = (e) => {

    const exp = new Date(`${this.state.month} ${this.state.year}`);
    const today = new Date();

    this.props.updateEmail(
      {
        userID: this.props.admin.user,
        token: this.props.admin.id
      },
      {
        credit: {
          name: this.state.name,
          number: this.state.number
        }
      });

    if(this.state.name !== undefined && this.state.number !== undefined && today < exp && this.state.cvv !== undefined && Object.keys(this.props.errorMessage).length === 0){
      this.props.makeModal({client: false, login: false});
      this.props.updateCheckout(
        {
          ...this.props.select
        },
        {
          ...this.props.checkout,
          "payment": true
        }
      );
    }
    else {
      if(e) e.preventDefault();
    }
  }

  verify = (e) => {

    const exp = new Date(`${this.state.month} ${this.state.year}`);
    const today = new Date();

    this.props.verifyPayment({
      ...this.state
    });

    if(this.state.name !== undefined && this.state.number !== undefined && today < exp && this.state.cvv !== undefined && Object.keys(this.props.errorMessage).length === 0){
      this.props.makeModal({client: false, login: false});
      this.props.updateCheckout(
        {
          ...this.props.select
        },
        {
          ...this.props.checkout,
          "payment": true
        }
      );
    }
    else {
      if(e) e.preventDefault();
    }
  }

  pop = (e) => {
    if(e) e.preventDefault();
    this.props.makeModal({
      "client": false,
      "login": false
    });
  }

  render() {
    console.log(this.state);
    const alert = (Object.keys(this.props.errorMessage).length !== 0) ?
      <Alert className="content text-center alertMessage" bsStyle="warning">{this.props.errorMessage.error}</Alert> :
      <div></div>;

    const submitButton = <NavLink to="/book-now/confirmation" onClick={this.update}>
        <Button bsStyle="primary">
          Continue
        </Button>
      </NavLink>;

    const verifyButton = <NavLink to="/book-now/confirmation" onClick={this.verify}>
        <Button bsStyle="primary">
          Continue
        </Button>
      </NavLink>;

    const continueButton = (this.state.cvv !== "") ?
      <NavLink to="/book-now/confirmation" onClick={this.handleContinue}>
        <Button bsStyle="primary" disabled={this.state.name === "" || this.state.number === ""}>
          Continue
        </Button>
      </NavLink>:
      <Button bsStyle="primary" disabled={this.state.name === "" || this.state.number === ""} onClick={() => this.props.makeModal({login: true})}>
        Continue
      </Button>;


    let client = <div>Loading</div>;
    if(this.props.data[0]){
      if(this.props.data[0]["credit"]){
        client = <div>
          <h3>{this.props.data[0]["credit"]["name"]}</h3>
          <p>{this.props.data[0]["credit"]["number"]}</p>
        </div>;
      }
    }


    const closeButton = <Button onClick={this.pop}>
      Close
    </Button>;

    //modal to add credit
    //modal to verify credit
    const selectModal = <Modal show={this.props.modalVisible.client} >
        <Modal.Header>
          <Modal.Title>Select Payment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <PayForm
            nameValue={this.state.name}
            numberValue={this.state.number}
            cvvValue={this.state.cvv}
            monthValue={this.state.month}
            yearValue={this.state.year}
            creditChange={this.onFormChange}
          />
          {alert}
        </Modal.Body>
        <Modal.Footer>
          <div className="text-center">
            {submitButton}{closeButton}
          </div>
        </Modal.Footer>
      </Modal> ;

    const verifyModal = <Modal show={this.props.modalVisible.login} >
        <Modal.Header>
          <Modal.Title>Verify Payment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <PayValidForm
            nameValue={this.state.name}
            numberValue={this.state.number}
            cvvValue={this.state.cvv}
            monthValue={this.state.month}
            yearValue={this.state.year}
            creditChange={this.onFormChange}
          />
          {alert}
        </Modal.Body>
        <Modal.Footer>
          <div className="text-center">
            {verifyButton}{closeButton}
          </div>
        </Modal.Footer>
      </Modal>;


    return (
      <div className="main-content not-found">
        <div className="well text-center">
          {client}
          <Button bsStyle="danger" onClick={() => this.props.makeModal({client: true})}>
            Edit
          </Button>
        </div>

        <div className="text-center">{continueButton}</div>
        {selectModal}
        {verifyModal}

      </div>
    );
  }
}


export default Payment;
