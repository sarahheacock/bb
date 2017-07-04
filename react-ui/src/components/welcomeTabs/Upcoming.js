import React from 'react';
import PropTypes from 'prop-types';
import { PageHeader, Button } from 'react-bootstrap';
import CalendarModal from '../modals/CalendarModal';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

class Upcoming extends React.Component {
  static propTypes = {
    fetchClient: PropTypes.func.isRequired,
    data: PropTypes.array.isRequired,
    admin: PropTypes.object.isRequired,
    refundClient: PropTypes.func.isRequired,
    makeModal: PropTypes.func.isRequired,
    modalVisible: PropTypes.object.isRequired,
    errorMessage: PropTypes.object.isRequired
  }

  constructor(props){
    super(props);
    BigCalendar.momentLocalizer(moment); // or globalizeLocalizer
    this.state = {
      month: new Date().getMonth(),
      target: {}
    };
  }

  componentDidMount(){
    //"/:pageID/rooms/upcoming/:request"
    this.props.fetchClient(`/api/admin/${this.props.admin.user}/${this.state.month}?token=${this.props.admin.id}`);
  }

  navigate = (date) => {
    this.state.month = date.getMonth();
    this.setState(this.state, () => this.props.fetchClient(`/api/admin/${this.props.admin.user}/${this.state.month}?token=${this.props.admin.id}`));
  }

  handleSelect = (event) => {
    this.state.target = event;
    //console.log(event);
    this.setState(this.state, () => this.props.makeModal({client: true}));
  }

  render(){
    console.log(this.state);
    let myEvents = [];
    if(this.props.data[0]){
      if(this.props.data[0]["start"]){
        myEvents = this.props.data;
      }
    }

    return (
      <div className="main-content">
        <h3>Check-in and Cancel Reservations</h3>
        <br />
        <BigCalendar
          events={myEvents}
          onNavigate={this.navigate}
          onSelectEvent={this.handleSelect}
        />
        <CalendarModal
          upcoming={this.state.target}
          errorMessage={this.props.errorMessage}
          modalVisible={this.props.modalVisible}
          makeModal={this.props.makeModal}
          admin={this.props.admin}
          refundClient={this.props.refundClient}
        />
      </div>
    );
  }
}

export default Upcoming;
