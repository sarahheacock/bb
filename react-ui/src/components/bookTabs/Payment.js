import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect, NavLink } from 'react-router-dom';
import { Form, FormControl, ControlLabel, FormGroup, Button, Col, Row, Modal, Alert } from 'react-bootstrap';
import PayForm from '../forms/PayForm';

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
    updateEmail: PropTypes.func.isRequired
  }

  constructor(props){
    super(props);
    this.state = {
      name: '',
      number: '',
      month: '',
      year: '',
      cvv: ''
    }
  }

  componentDidMount() {
    this.props.fetchClient(this.props.admin);
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
    this.props.updateCheckout(
      {
        ...this.props.select
      },
      {
        ...this.props.checkout,
        "payment": true
      }
    );

    if(this.state.cvv === ""){
      this.props.makeModal({
        client: true
      });
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
      (this.props.admin.username) ?
        <Alert className="content text-center alertMessage" bsStyle="success">{`Welcome, ${this.props.admin.username}`}</Alert>:
        <div></div>;


    const submitButton = <button className="btn btn-primary" onClick={this.verify} onClick={() => {
        this.props.updateEmail(this.props.admin.user, {
          credit: {
            name: this.state.name,
            number: this.state.number,
            cvv: `${this.state.cvv}/${this.state.month}/${this.state.year}`
          },
          token: this.props.admin.id
        });
      }}>
        Submit
    </button>;

    const continueButton = (this.state.cvv !== "") ?
      <NavLink to="/book-now/confirmation" onClick={this.handleContinue}>
        <Button bsStyle="primary" disabled={this.state.name === ""}>
          Continue
        </Button>
      </NavLink>:
      <Button bsStyle="primary" disabled={this.state.name === ""} onClick={() => this.props.makeModal({client: true})}>
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
        </Modal>
      </div>
    );
  }
}


export default Payment;


// import React from 'react';
// import PropTypes from 'prop-types';
// import { Route, Redirect, NavLink } from 'react-router-dom';
// import { PageHeader } from 'react-bootstrap';
// import PayForm from '../forms/PayForm';
//
// class Payment extends React.Component {
//   static propTypes = {
//   }
//
//   constructor(props){
//     super(props);
//     this.state = {
//       name: '',
//       credit: '',
//       number: '',
//       month: '',
//       year: '',
//       cvv: '',
//     }
//   }
//
//   onCreditChange = (e) => {
//     this.state[e.target.name] = e.target.value;
//     this.setState(this.state);
//   }
//
//
//   //makes modal disappear
//   pop = (e) => {
//     if(e) e.preventDefault();
//     this.props.makeModal();
//   }
//
//   //submit button turns modalVisible to false and
//   //links back to confirmation page
//   //link is currently unecessary
//   render() {
//     return (
//       <div className="main-content not-found">
//           <PayForm
//             nameValue={this.state.name}
//             numberValue={this.state.number}
//             cvvValue={this.state.cvv}
//             monthValue={this.state.month}
//             yearValue={this.state.year}
//             creditChange={this.onCreditChange}
//           />
//
//
//
//
//       </div>
//     );
//   }
// }
//
//
// export default Payment;
