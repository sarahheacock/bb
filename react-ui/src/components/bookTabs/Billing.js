import React from 'react';
import PropTypes from 'prop-types';

import EditButton from '../buttons/EditButton';
import ContinueButton from '../buttons/ContinueButton';
import { initialCheckout } from '../data/options';


class Billing extends React.Component {
  static propTypes = {
    data: PropTypes.array.isRequired,
    user: PropTypes.object.isRequired,
    checkout: PropTypes.object.isRequired,

    getData: PropTypes.func.isRequired,
    updateState: PropTypes.func.isRequired,
  }

  componentDidMount() {
    this.props.getData(`/locked/user/${this.props.user.id}?token=${this.props.user.token}`);
  }


  render(){
    let client = <div></div>;
    let continueButton = <div></div>;

    if(this.props.data[0]){
      if(this.props.data[0]["billing"]){

        const billing = this.props.data[0]["billing"];
        const editArr = billing.split("/");

        let editObj = { email: this.props.data[0]["email"] };
        Object.keys(initialCheckout.billing.address).forEach((add, i) => (
          editObj[add] = editArr[i]
        ));

        client = <div className="well text-center">
          <h3>{this.props.data[0]["email"]}</h3>
          <p>{billing.replace(/\/ \//g, ", ").replace(/\/\//g, ", ").replace(/\//g, ", ")}</p>
          <EditButton
            admin={this.props.user.admin}
            updateState={this.props.updateState}
            dataObj={editObj}
            title="Edit Billing"
            pageSection="book-now"
            length={2}
          />
        </div>

        const credit = this.props.data[0]["credit"];
        let creditObj = {};
        Object.keys(initialCheckout.payment).forEach((add, i) => {
          if(add === "Name on Card") return creditObj[add] = credit["name"];
          else if(add === "number") return creditObj[add] = credit["number"];
          else return creditObj[add] = initialCheckout.payment[add];
        });

        continueButton = <div className="text-center">
          <EditButton
            admin={this.props.user.admin}
            updateState={this.props.updateState}
            dataObj={{
              edit: {
                modalTitle: "Edit Payment",
                length: 2,
                pageSection: "",
                dataObj: creditObj
              },
              checkout: {
                ...this.props.checkout,
                billing: editObj
              }
            }}
            title="Continue"
            pageSection="book-now"
            length={2}
          />
        </div>;
      }
    }

    return (
      <div className="main-content">
        {client}
        {continueButton}
      </div>
    );
  }
}


export default Billing;

// dataObj={{
//   checkout: {
//     ...this.props.checkout,
//     billing: {
//       ...editObj,
//       name: '',
//     }
//   },
//   edit: {
//
//   }
// }}
// title="Continue"
// updateState={this.props.updateState}
// checkout={this.props.checkout}
// user={this.props.user}
// />
