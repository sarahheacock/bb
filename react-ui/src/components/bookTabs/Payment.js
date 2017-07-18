import React from 'react';
import PropTypes from 'prop-types';

import EditButton from '../buttons/EditButton';


const Payment = (props) => {

    const payment = props.checkout.payment;
    const paymentInfo = Object.keys(payment).map((k) => (
      <p><b>{`${k.charAt(0).toUpperCase()}${k.slice(1)}: `}</b>{payment[k]}</p>
    ));

    return (
      <div className="main-content">
        <div className="well text-center">
          <div>{paymentInfo}</div>
          <EditButton
            user={props.user}
            updateState={props.updateState}
            dataObj={props.checkout}
            title="Edit Payment"
            pageSection="payment"
            length={2}
          />
        </div>

        <div className="text-center">
          <EditButton
            user={props.user}
            updateState={props.updateState}
            dataObj={props.checkout}
            title="Continue"
            pageSection="payment"
            length={2}
          />
        </div>
      </div>
    );
}


export default Payment;

Payment.propsTypes = {
  user: PropTypes.object.isRequired,
  checkout: PropTypes.object.isRequired,

  updateState: PropTypes.func.isRequired,
};
