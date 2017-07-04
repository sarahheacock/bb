import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect, NavLink } from 'react-router-dom';
import { PageHeader, Row, Col, Button, Modal, Alert, FormGroup, ControlLabel, FormControl } from 'react-bootstrap';
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

  constructor(props){
    super(props);
    this.state = {
      title: '',
      notes: ''
    }
  }

  componentDidMount(){
    if(this.props.admin.admin === false) this.props.fetchClient(`/locked/user/${this.props.admin.user}?token=${this.props.admin.id}`);
    else this.props.makeModal({login: true});
  }

  confirm = () => {
    //this.props.makeModal({client: true});
    //const month = new Date(this.props.select.arrive).getMonth();
    if(this.props.admin.admin){
      this.props.chargeClient({admin: this.props.admin, select: {
        start: this.props.select.arrive,
        end: this.props.select.depart,
        title: this.state.title,
        event: {
          guests: this.props.select.guests,
          roomID: this.props.select.roomID._id,
          cost: this.props.select.cost,
          notes: this.state.notes
        }
      }});
    }
    else {
      this.props.chargeClient({admin: this.props.admin, select: {
        start: this.props.select.arrive,
        end: this.props.select.depart,
        event: {
          guests: this.props.select.guests,
          roomID: this.props.select.roomID._id,
          cost: this.props.select.cost
        }
      }});
    }
  }

  handleForm = (e) => {
    this.state[e.target.name] = e.target.value;
    this.setState(this.state);
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
                {(this.props.admin.credit.month)?<div><p>{`${this.props.admin.credit.month} ${this.props.admin.credit.year}`}</p><p>{this.props.admin.credit.cvv}</p></div>:<p>Loading</p>}
              </div>
            </Col>
          </Row>
          <hr />
        </div>
      }
      else if(this.props.admin.admin){
        client = <div className="text-center">
          <Row>
            <Col sm={3}>
              <h4>Contact: </h4>
            </Col>
            <Col sm={8}>
              <div className="well text-center">
                <p>{this.state.title}</p>
              </div>
            </Col>
          </Row>
          <hr />
        </div>
      }
    }

    const closeButton = (Object.keys(this.props.errorMessage).length === 0) ?
      <Button onClick={this.pop}>
        Continue
      </Button>:
      <Button onClick={this.pop}>
        Close
      </Button>;

    return (
      <div className="main-content text-center">
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
              <p><b>Arrive: </b>{`${moment(this.props.select.arrive + (5*60*60*1000)).format('LLLL')}`}</p>
              <p><b>Depart: </b>{`${moment(this.props.select.depart).format('LLLL')}`}</p>
            </div>
          </Col>
        </Row>
      <hr />
        {client}
        {confirmButton}

        <Modal show={this.props.modalVisible.client} >
          <Modal.Body>
            {alert}
          </Modal.Body>
          <Modal.Footer>
            <div className="text-center">{closeButton}</div>
          </Modal.Footer>
        </Modal>

        <Modal show={this.props.modalVisible.login} >
          <Modal.Body>
            <FormGroup>
              <ControlLabel>Email *</ControlLabel>
              <FormControl name="title" type="email" value={this.state.title} onChange={this.handleForm} required/>
            </FormGroup>

            <FormGroup>
              <ControlLabel>Notes *</ControlLabel>
              <FormControl name="notes" type="text" value={this.state.notes} onChange={this.handleForm} required/>
            </FormGroup>
            {alert}
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={() => {if(this.state.title) this.props.makeModal({login: false, client: false});} }>
              Submit
            </Button>
          </Modal.Footer>
        </Modal>

      </div>
    );
  }
}

export default Confirmation;
