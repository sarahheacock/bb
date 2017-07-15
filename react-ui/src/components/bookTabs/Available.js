import React from 'react';
import PropTypes from 'prop-types';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import { ControlLabel, FormGroup, Row, Col, Button, Modal } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
//import Login from '../Login';
import EditButton from '../buttons/EditButton';
import ContinueButton from '../buttons/ContinueButton';


class Available extends React.Component {
  static propTypes = {
    data: PropTypes.array.isRequired,
    user: PropTypes.object.isRequired,
    checkout: PropTypes.object.isRequired,

    fetchSearch: PropTypes.func.isRequired,
    updateState: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      arrive: props.checkout.selected.arrive,
      depart: props.checkout.selected.depart,
      guests: props.checkout.selected.guests
    };
  }

  componentDidMount(){
    this.props.fetchSearch(this.props.checkout.selected);
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


  render() {
    const guestOptions = [...new Array(6)].map((ob, i) => (
      <option value={i} key={`guest${i}`}>
        {i}
      </option>
    ));

    //if client is signed in, button will be navlink to billing
    //if client is not signed in, button will be login modal
    //make sure data is defined
    let available = <div className="well text-center well-option">No available rooms for these dates.</div>;
    if(this.props.data[0]){
      //make sure correct data is fetched
      if(this.props.data[0]["cost"]){

        available = this.props.data.map(room => (
          <div className="well text-center well-option" key={`available${room._id}`}>
            <img className="room-img round" src={room.image} alt={room.name} />
            <h3>{room.title}</h3>
            <p>{`$${room.cost}.00`}</p>
              <EditButton
                user={this.props.user}
                updateState={this.props.updateState}
                dataObj={{
                  ...this.props.checkout,
                  selected: {
                    roomID: room,
                    arrive: this.state.arrive,
                    depart: this.state.depart,
                    guests: this.state.guests
                  }
                }}
                title="Select Room"
                pageSection="availability"
                length={2}
              />
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
      </div>

    );
  }
}

export default Available;

// <div>
//   {
//     (this.props.admin.admin === true) ?
//     <Modal show={this.props.modalVisible.client} >
//       <Modal.Body>
//         Hello
//       </Modal.Body>
//       <Modal.Footer>
//         <div className="text-center">
//           <Button onClick={() => this.props.makeModal({client: false})}>
//             Close
//           </Button>
//         </div>
//       </Modal.Footer>
//     </Modal>:
//
//     <Modal show={this.props.modalVisible.login} >
//       <Modal.Body>
//         <Login
//           errorMessage={this.props.errorMessage}
//           admin={this.props.admin}
//           verifyEmail={this.props.verifyEmail}
//           logout={this.props.logout}
//           createEmail={this.props.createEmail}
//           modalVisible={this.props.modalVisible}
//           makeModal={this.props.makeModal}
//           checkoutSelected={this.props.checkout.selected}
//         />
//       </Modal.Body>
//       <Modal.Footer>
//         <div className="text-center">{closeButton}</div>
//       </Modal.Footer>
//     </Modal>
//   }
//           </div>
