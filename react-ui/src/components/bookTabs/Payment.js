import React from 'react';
import PropTypes from 'prop-types';

import EditButton from '../buttons/EditButton';
import ContinueButton from '../buttons/ContinueButton';
import { initialCheckout, initialEdit } from '../data/options';


class Payment extends React.Component {
  static propTypes = {
    data: PropTypes.array.isRequired,
    user: PropTypes.object.isRequired,
    checkout: PropTypes.object.isRequired,
    checkEdit: PropTypes.bool.isRequired,

    getData: PropTypes.func.isRequired,
    updateState: PropTypes.func.isRequired,
  }


  componentDidMount() {
    this.props.getData(`/locked/user/${this.props.user.id}?token=${this.props.user.token}`);
  }

  // componentDidUpdate(prevProps, prevState) {
  //   if(this.state.restart){
  //
  //
  //     console.log("checkEdit", this.props.checkEdit);
  //     if(this.props.checkEdit){
  //       this.setState({restart: false}, () => this.props.updateState({
  //         edit: {
  //           length: 2,
  //           modalTitle: "Edit Payment",
  //           pageSection: "",
  //           dataObj: this.state.editObj
  //         }
  //       }));
  //     }
  //   }
  // }


  render(){
    // console.log("state", this.state);
    let client = <div></div>;
    let continueButton = <div></div>;

    if(this.props.data[0]){
      if(this.props.data[0]["credit"]){
    
        client = <div className="well text-center">
          <h3>{credit["name"]}</h3>
          <EditButton
            admin={this.props.user.admin}
            updateState={this.props.updateState}
            dataObj={{...editObj}}
            title="Edit Payment"
            pageSection="book-now"
            length={2}
          />
        </div>

        continueButton = <div className="text-center">

          <ContinueButton
            dataObj={{
              checkout: {
                ...this.props.checkout,
                payment: this.props.data[0]["credit"]
              }
            }}
            title="Continue"
            updateState={this.props.updateState}
            checkout={this.props.checkout}
            user={this.props.user}
          />
        </div>;
      }
    }

    return (
      <div className="main-content">

      </div>
    );
  }
}


export default Payment;
