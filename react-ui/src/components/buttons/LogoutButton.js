import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import { initialPage, initialUser, initialMessage, initialCheckout } from '../data/options';

const LogoutButton = (props) => {
  return (
    <div className="text-center">
      <Button onClick={() => props.updateState({
        page: {
          ...initialPage
        },
        user: {
          ...initialUser
        },
        message: {
          ...initialMessage
        },
        checkout: {
          ...initialCheckout
        }
      })}>
        Logout
      </Button>
    </div>
  );
};


export default LogoutButton;

LogoutButton.propTypes = {
  updateState: PropTypes.func.isRequired,
};
