import React from 'react';
import PropTypes from 'prop-types';

import EditButton from '../buttons/EditButton';
import ContinueButton from '../buttons/ContinueButton';
import { initialCheckout } from '../data/options';


class Billing extends React.Component {
  static propTypes = {
    //data: PropTypes.array.isRequired,
    user: PropTypes.object.isRequired,
    checkout: PropTypes.object.isRequired,

    getData: PropTypes.func.isRequired,
    updateState: PropTypes.func.isRequired,
  }

  // componentDidMount() {
  //   this.props.getData(`/locked/user/${this.props.user.id}?token=${this.props.user.token}`);
  // }


  render(){
    let client = <div></div>;
    let continueButton = <div></div>;

    if(this.props.user.username){
    //   if(this.props.data[0]["billing"]){

        // const billing = this.props.data[0]["billing"];
        // const editArr = billing.split("/");
        //
        // let editObj = { email: this.props.data[0]["email"] };
        // Object.keys(initialCheckout.billing.address).forEach((add, i) => (
        //   editObj[add] = editArr[i]
        // ));
        const billing = this.props.checkout.billing;
        const address = Object.keys(billing.address).map((k) => (
          <p><b>{`${k.charAt(0).toUpperCase()}${k.slice(1)}: `}</b>{billing.address[k]}</p>
        ));

        client = <div className="well text-center">
          <h3>{billing["email"]}</h3>
          <div>{address}</div>
          <EditButton
            user={this.props.user}
            updateState={this.props.updateState}
            dataObj={this.props.checkout}
            title="Edit Billing"
            pageSection="billing"
            length={2}
          />
        </div>
//START HERE!!!
        // const credit = this.props.data[0]["credit"];
        // let creditObj = {};
        // Object.keys(initialCheckout.payment).forEach((add, i) => {
        //   if(add === "Name on Card") return creditObj[add] = credit["name"];
        //   else if(add === "number") return creditObj[add] = credit["number"];
        //   else return creditObj[add] = initialCheckout.payment[add];
        // });

        continueButton = <div className="text-center">
          <EditButton
            user={this.props.user}
            updateState={this.props.updateState}
            dataObj={this.props.checkout}
            title="Continue"
            pageSection="billing"
            length={2}
          />
        </div>;
    //   }
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
