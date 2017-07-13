import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { initialEdit, initialCheckout } from '../data/options';

const ContinueButton = (props) => {
  const roomSelected = Object.keys(props.checkout.selected.roomID).length > 0 && !(!props.user.username);
  const billed = !(!props.checkout.billing.email);
  const paid = !(!props.checkout.payment.number);

  console.log("roomSelected", roomSelected);
  console.log("billed", billed);
  console.log("paid", paid);

  let next = "/book-now/availability";
  if((roomSelected && props.user.admin === true) || (paid && props.user.admin === false)){
    next = "/book-now/confirmation";
  }
  else if(billed && props.user.admin === false){
    next = "/book-now/payment";
  }
  else if(roomSelected && props.user.admin === false){
    next = "/book-now/billing";
  }


  console.log("next", next);

  return (
    <NavLink to={next} onClick={(e) => (
      props.updateState({
        edit: initialEdit,
        ...props.dataObj
      })
    )}>
      <Button>
        {props.title}
      </Button>
    </NavLink>
  );
}


export default ContinueButton;

ContinueButton.propTypes = {
  dataObj: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  checkout: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,

  updateState: PropTypes.func.isRequired,
};
