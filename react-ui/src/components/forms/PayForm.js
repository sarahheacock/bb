import React from 'react';
import PropTypes from 'prop-types';
import { Button, Form, FormControl, ControlLabel, FormGroup, Checkbox } from 'react-bootstrap';

import { Months, Years } from '../data/options';

const PayForm = (props) => {
  const monthOptions = Months.map((month) => (
    <option
    value={month}
    key={month}
    >
      {month}
    </option>
  ));

  const yearOptions = Years.map((year) => (
    <option
    value={year}
    key={year}
    >
      {year}
    </option>
  ));

  return (
    <Form className="content">

        <FormGroup>
          <ControlLabel>Name on Card *</ControlLabel>
          <FormControl name="name" type="text" value={props.nameValue} onChange={props.creditChange} required/>
        </FormGroup>

        <FormGroup>
          <ControlLabel>Debit/Credit Card Number *</ControlLabel>
          <FormControl name="name" type="text" value={props.cardValue} onChange={props.creditChange} required/>
        </FormGroup>

        <FormGroup>
          <ControlLabel>Expiration Month *</ControlLabel>
          <FormControl name="month" componentClass="select" value={props.monthValue} onChange={props.creditChange} required>
            {monthOptions}
          </FormControl>
        </FormGroup>

        <FormGroup>
          <ControlLabel>Expiration Year *</ControlLabel>
          <FormControl name="year" componentClass="select" value={props.yearValue} onChange={props.creditChange} required>
            {yearOptions}
          </FormControl>
        </FormGroup>

        <FormGroup>
          <ControlLabel>CVV *</ControlLabel>
          <FormControl name="cvv" type="text" value={props.cvvValue} onChange={props.creditChange} required/>
        </FormGroup>

    </Form>
  );
}


export default PayForm;

PayForm.propTypes = {
  //emailValue
  nameValue: PropTypes.string.isRequired,
  numberValue: PropTypes.string.isRequired,
  cvvValue: PropTypes.string.isRequired,
  monthValue: PropTypes.string.isRequired,
  yearValue: PropTypes.string.isRequired,
  expChange: PropTypes.func.isRequired,
  change: PropTypes.func.isRequired,
};
