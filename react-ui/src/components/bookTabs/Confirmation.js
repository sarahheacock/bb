import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect, NavLink } from 'react-router-dom';
import { PageHeader, Row, Col, Button, Modal, Alert } from 'react-bootstrap';
import moment from 'moment';

class Confirmation extends React.Component {
  //component will merely present provided info and create navlinks to
  //edit info along with necessary modal visibility

  //confirm button will initialize payment functions and provide modal to
  //personal profile page
  static propTypes = {
    data: PropTypes.array.isRequired,
    admin: PropTypes.object.isRequired,
    fetchClient: PropTypes.func.isRequired,
    select: PropTypes.object.isRequired,
    makeModal: PropTypes.func.isRequired,
    modalVisible: PropTypes.object.isRequired,
    errorMessage: PropTypes.object.isRequired,
    chargeClient: PropTypes.func.isRequired
  }

  componentDidMount(){
    this.props.fetchClient(`/locked/user/${this.props.admin.user}?token=${this.props.admin.id}`);
  }

  confirm = () => {
    this.props.makeModal({client: true});
    this.props.chargeClient({admin: this.props.admin, select: this.props.select});
  }

  pop = () => {
    this.props.makeModal({client: false});
  }

  render(){

    const alert = (Object.keys(this.props.errorMessage).length !== 0) ?
      <Alert className="content text-center alertMessage" bsStyle="warning">{this.props.errorMessage.error}</Alert> :
      <Alert className="content text-center alertMessage" bsStyle="success">{`Thank you for staying with us, ${this.props.admin.username}!`}</Alert>;

    const confirmButton = <Button bsStyle="primary" onClick={this.confirm}>
        Confirm Reservation
      </Button>;

    let client = <div>Loading</div>;

    if(this.props.data[0]){
      if(this.props.data[0]["credit"]){
        const arr = this.props.data[0]["billing"].split('/');

        client = <div className="text-center">
          {confirmButton}
          <hr />
          <Row>
            <Col sm={3}>
              <h4>Room: </h4>
            </Col>
            <Col sm={8}>
              <div className="well text-center">
                <img className="room-img" src={this.props.select.roomID.image} alt={this.props.select.roomID.title} />
                <h3>{this.props.select.roomID.title}</h3>
                <p>{`$${this.props.select.roomID.cost}.00`}</p>
                <p>{`${this.props.select.guests} guests`}</p>
                <p>{`Arrive ${moment(this.props.select.arrive + (5*60*60*1000)).format('LLLL')}`}</p>
                <p>{`Depart ${moment(this.props.select.depart).format('LLLL')}`}</p>
              </div>
            </Col>
          </Row>
          <hr />
          <Row>
            <Col sm={3}>
              <h4>Billing: </h4>
            </Col>
            <Col sm={8}>
              <div className="well text-center">
                <h3>{this.props.data[0]["email"]}</h3>
                <p>{`${arr[0]} ${arr[1]}, ${arr[2]}, ${arr[3]} ${arr[4]} ${arr[5]}`}</p>
              </div>
            </Col>
          </Row>
          <hr />
          <Row>
            <Col sm={3}>
              <h4>Payment: </h4>
            </Col>
            <Col sm={8}>
              <div className="well text-center">
                <h3>{this.props.data[0]["credit"]["name"]}</h3>
                <p>{this.props.data[0]["credit"]["number"]}</p>
                <p>{`${this.props.admin.credit.month} ${this.props.admin.credit.year}`}</p>
                <p>{this.props.admin.credit.cvv}</p>
              </div>
            </Col>
          </Row>
          <hr />
          {confirmButton}
        </div>
      }
    }

    const closeButton = (Object.keys(this.props.errorMessage).length === 0) ?
      <NavLink to="/welcome" onClick={this.pop}>
        <Button>
          Continue
        </Button>
      </NavLink>:
      <Button onClick={this.pop}>
        Continue
      </Button>;

    return (
      <div className="main-content">
        {client}

        <Modal show={this.props.modalVisible.client} >
          <Modal.Body>
            {alert}
          </Modal.Body>
          <Modal.Footer>
            <div className="text-center">{closeButton}</div>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default Confirmation;
