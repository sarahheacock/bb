import React from 'react';
import PropTypes from 'prop-types';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import { ControlLabel, FormGroup, Row, Col, Button, Modal } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import Login from '../Login';

class Available extends React.Component {
  static propTypes = {
    data: PropTypes.array.isRequired,
    updateCheckout: PropTypes.func.isRequired,
    fetchSearch: PropTypes.func.isRequired,
    select: PropTypes.object.isRequired,
    checkout: PropTypes.object.isRequired,
    admin: PropTypes.object.isRequired,
    makeModal: PropTypes.func.isRequired,
    modalVisible: PropTypes.object.isRequired,
    verifyEmail: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired,
    createEmail: PropTypes.func.isRequired,
    errorMessage: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
      arrive: props.select.arrive,
      depart: props.select.depart,
      guests: props.select.guests,
      roomID: props.select.roomID
    };
  }

  componentDidMount(){
    this.props.fetchSearch(this.props.select);
  }

  handleStart = (date) => {
    const arrive = date.toDate().getTime();
    const depart = (arrive >= this.state.depart) ?
      arrive + (24*60*60*1000) :
      this.state.depart;
    this.setState({
      arrive: arrive,
      depart: depart
    }, () => this.props.fetchSearch(this.state));
  }


  handleLeave = (date) => {
    this.setState({
      depart: date.toDate().getTime(),
    }, () => this.props.fetchSearch(this.state));
  }

  handleGuests = (e) => {
    this.setState({
      guests: e.target.value,
    }, () => this.props.fetchSearch(this.state));
  }

  handleSelect = (e) => {
    this.props.updateCheckout(
      {
        "roomID": JSON.parse(e.target.name),
        "guests":this.state.guests,
        "arrive":new Date(this.state.arrive).getTime(),
        "depart":new Date(this.state.depart).getTime()
      },
      {
        ...this.props.checkout,
        "selected": true
      }
    );
    if(!this.props.admin.username){
      this.props.makeModal({
        login: true
      });
    }
  }

  render() {
    const guestOptions = [...new Array(6)].map((ob, i) => (
      <option value={i} key={`guest${i}`}>
        {i}
      </option>
    ));

    const closeButton = (this.props.admin.username) ?
      <div></div> :
      <Button bsStyle="danger" onClick={(e) => this.props.makeModal({
        login: false
      })}>
        Cancel
      </Button>;

    //if client is signed in, button will be navlink to billing
    //if client is not signed in, button will be login modal
    //make sure data is defined
    let available = <div></div>;
    if(this.props.data[0]){
      //make sure correct data is fetched
      if(this.props.data[0]["cost"]){
        available = this.props.data.map(room => (
          <div className="well text-center well-option" key={`available${room._id}`}>
            <img className="room-img round" src={room.image} alt={room.name} />
            <h3>{room.title}</h3>
            <p>{`$${room.cost}.00`}</p>
            {(this.props.admin.username) ?
                <NavLink className="select" bsStyle="primary" to="/book-now/billing">
                  <Button name={JSON.stringify({title: room.title, image: room.image, cost: room.cost, _id: room._id})} onClick={this.handleSelect}>
                    Select
                  </Button>
                </NavLink> :
                <Button name={JSON.stringify({title: room.title, image: room.image, cost: room.cost, _id: room._id})} bsStyle="primary" onClick={this.handleSelect}>
                  Select
                </Button>}
          </div>
        ));
      }
    }


    return (
      <div className="tab-content text-center">
        <form className="room-form" >
          <FormGroup>
            <Row className="clearfix text-center">
              <Col sm={4}>
                <ControlLabel>Number of Guests</ControlLabel><br />
              </Col>
              <Col sm={4}>
                <select
                  className="form-control guest-num"
                  id="guest-num"
                  onChange={this.handleGuests}
                  value={this.state.guests}
                >
                  {guestOptions}
                </select>
              </Col>
              </Row>
          </FormGroup>

          <FormGroup>
            <Row className="clearfix text-center">
              <Col sm={4}>
                <ControlLabel>Arrival</ControlLabel>
              </Col>
              <Col sm={4}>
                <DatePicker
                  id="arrivalPicker"
                  className="form-control date pull-left"
                  selected={moment(this.state.arrive)}
                  onChange={this.handleStart}
                  minDate={moment()}
                  maxDate={moment().add(365, "days")}
                />
              </Col>
            </Row>
          </FormGroup>

          <FormGroup>
            <Row>
              <Col sm={4}>
                <ControlLabel>Departure</ControlLabel>
              </Col>
              <Col sm={4}>
                <DatePicker
                  id="departPicker"
                  className="form-control date pull-right"
                  selected={moment(this.state.depart)}
                  onChange={this.handleLeave}
                  minDate={moment()}
                  maxDate={moment().add(365, "days")}
                />
              </Col>
            </Row>
          </FormGroup>
        </form>

        {available}

        <Modal show={this.props.modalVisible.login} >
          <Modal.Body>
            <Login
              errorMessage={this.props.errorMessage}
              admin={this.props.admin}
              verifyEmail={this.props.verifyEmail}
              logout={this.props.logout}
              createEmail={this.props.createEmail}
              modalVisible={this.props.modalVisible}
              makeModal={this.props.makeModal}
              checkoutSelected={this.props.checkout.selected}
            />
          </Modal.Body>
          <Modal.Footer>
            <div className="text-center">{closeButton}</div>
          </Modal.Footer>
        </Modal>
      </div>

    );
  }
}

export default Available;
