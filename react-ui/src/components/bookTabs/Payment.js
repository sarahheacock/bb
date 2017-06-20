import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect, NavLink } from 'react-router-dom';
import { PageHeader } from 'react-bootstrap';
import PayForm from '../forms/PayForm';

class Payment extends React.Component {
  static propTypes = {
  }

  constructor(props){
    super(props);
    this.state = {
      name: '',
      credit: '',
      number: '',
      month: '',
      year: '',
      cvv: '',
    }
  }

  onCreditChange = (e) => {
    this.state[e.target.name] = e.target.value;
    this.setState(this.state);
  }


  //makes modal disappear
  pop = (e) => {
    if(e) e.preventDefault();
    this.props.makeModal();
  }

  //submit button turns modalVisible to false and
  //links back to confirmation page
  //link is currently unecessary
  render() {
    return (
      <div className="main-content not-found">
          <PayForm
            nameValue={this.state.name}
            numberValue={this.state.number}
            cvvValue={this.state.cvv}
            monthValue={this.state.month}
            yearValue={this.state.year}
            creditChange={this.onCreditChange}
          />




      </div>
    );
  }
}


export default Payment;
