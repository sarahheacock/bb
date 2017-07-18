import React from 'react';
import PropTypes from 'prop-types';

import EditButton from '../buttons/EditButton';


const Billing = (props) => {

    const billing = props.checkout.billing;
    const address = Object.keys(billing.address).map((k) => (
      <p><b>{`${k.charAt(0).toUpperCase()}${k.slice(1)}: `}</b>{billing.address[k]}</p>
    ));

    return (
      <div className="main-content">
        <div className="well text-center">
          <h3>{billing["email"]}</h3>
          <div>{address}</div>
          <EditButton
            user={props.user}
            updateState={props.updateState}
            dataObj={props.checkout}
            title="Edit Billing"
            pageSection="billing"
            length={2}
          />
        </div>

        <div className="text-center">
          <EditButton
            user={props.user}
            updateState={props.updateState}
            dataObj={props.checkout}
            title="Continue"
            pageSection="billing"
            length={2}
          />
        </div>
      </div>
    );
}


export default Billing;

Billing.propsTypes = {
  user: PropTypes.object.isRequired,
  checkout: PropTypes.object.isRequired,

  updateState: PropTypes.func.isRequired,
};
