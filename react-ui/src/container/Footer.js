import React from 'react';
import PropTypes from 'prop-types';
import { Col, Row } from 'react-bootstrap';
//import MessageModal from '../components/modals/MessageModal';
import EditModal from '../components/modals/EditModal';
import EditButton from '../components/buttons/EditButton';
var FaLinked = require('react-icons/lib/fa/linkedin-square');
var FaFacebook = require('react-icons/lib/fa/facebook-square');

const Footer = (props) => (
  <footer className="text-center content">
    <EditModal
      user={props.user}
      edit={props.edit}
      message={props.message}
      checkout={props.checkout}

      chargeClient={props.chargeClient}
      refundClient={props.refundClient}
      putData={props.putData}
      postData={props.postData}
      deleteData={props.deleteData}

      updateState={props.updateState}
    />


    <Row className="clearfix">
      <Col sm={6}>
        <h3>Around the Web</h3>
        <h3>
          <a className="icon" href="#" onClick={(e) => {if(e) e.preventDefault(); window.open("https://www.linkedin.com/in/nancy-darr-968364b");}}>
            <FaLinked className="link falinked" />
          </a>
          <a className="icon" href="#" >
            <FaFacebook className="link fafacebook" onClick={(e) => {if(e) e.preventDefault(); window.open("https://www.facebook.com/groups/PediatricBalanceScale/");}}/>
          </a>
        </h3>
      </Col>
      <Col sm={6}>
        <h3>Get More Info</h3>
        <h3>
          <EditButton
            user={props.user}
            updateState={props.updateState}
            dataObj={{}}
            title="Send Message"
            pageSection=""
            length={2}
          />
        </h3>
      </Col>
    </Row>
  </footer>

);


export default Footer;

Footer.propTypes = {
  user: PropTypes.object.isRequired,
  page: PropTypes.object.isRequired,
  edit: PropTypes.object.isRequired,
  message: PropTypes.object.isRequired,
  checkout: PropTypes.object.isRequired,

  refundClient: PropTypes.func.isRequired,
  chargeClient: PropTypes.func.isRequired,
  putData: PropTypes.func.isRequired,
  postData: PropTypes.func.isRequired,
  deleteData: PropTypes.func.isRequired,

  updateState: PropTypes.func.isRequired,
};
