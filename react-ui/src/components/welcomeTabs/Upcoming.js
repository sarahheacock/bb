import React from 'react';
import PropTypes from 'prop-types';
import { PageHeader, Button } from 'react-bootstrap';
import CalendarModal from '../modals/CalendarModal';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import { initialPage } from '../data/options';
import EditModal from '../modals/EditModal';

class Upcoming extends React.Component {
  static propTypes = {
    page: PropTypes.object.isRequired,
    data: PropTypes.array.isRequired,
    user: PropTypes.object.isRequired,
    message: PropTypes.object.isRequired,
    getData: PropTypes.func.isRequired,
    refundClient: PropTypes.func.isRequired,
    updateState: PropTypes.func.isRequired
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
    this.props.getData(`/api/admin/${this.props.user.id}/${this.state.month}?token=${this.props.user.token}`);
  }

  navigate = (date) => {
    this.state.month = date.getMonth();
    this.setState(this.state, () => this.props.getData(`/api/admin/${this.props.admin.user}/${this.state.month}?token=${this.props.admin.id}`));
  }

  handleSelect = (event) => {
    this.state.target = event;
    //console.log(event);
    this.setState(this.state, () => this.props.updateState({
      page: {
        ...initialPage,
        modalOne: true
      }
    }));
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
          message={this.props.message}
          page={this.props.page}
          updateState={this.props.updateState}
          user={this.props.user}
          refundClient={this.props.refundClient}
        />
        <EditModal
          user={this.props.user}
          modalEdit={this.props.page.edit}
          editData={this.props.refundClient}
          updateState={this.props.updateState}
          url={(this.props.data[0]) ? `/api/admin/${this.props.user.id}/${this.state.target._id}?token=${this.props.user.token}` : ''}
          next="#"
          dataObj={ {...this.state.target, modalTitle: "Cancel Reservation", length: 2} }
          message={this.props.message}
        />
      </div>
    );
  }
}

export default Upcoming;
