import React from 'react';
import PropTypes from 'prop-types';
import { PageHeader, Button } from 'react-bootstrap';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

class Upcoming extends React.Component {
  static propTypes = {
    fetchClient: PropTypes.func.isRequired,
    data: PropTypes.array.isRequired,
    admin: PropTypes.object.isRequired,
  }

  constructor(props){
    super(props);
    BigCalendar.momentLocalizer(moment); // or globalizeLocalizer
    this.state = {
      month: new Date().getMonth()
    };
  }

  componentDidMount(){
    ///:pageID/:section/upcoming/:upcomingSection/
    this.props.fetchClient(`/api/admin/${this.props.admin.user}/${this.state.month}/upcoming/${this.state.month}?token=${this.props.admin.id}`);
  }

  navigate = (date) => {
    //console.log(date.getMonth());
    this.state.month = date.getMonth();
    this.props.fetchClient(`/api/admin/${this.props.admin.user}/${this.state.month}/upcoming/${this.state.month}?token=${this.props.admin.id}`);
    this.setState(this.state);
  }

  render(){
    //console.log(this.state);
    let myEvents = [];
    if(this.props.data[0]){
      if(this.props.data[0]["arrive"]){
        myEvents = this.props.data.map((d) =>
          ({
            title: d.userEmail,
            start: d.arrive,
            end: d.depart,
            isSelected: false
          }));
      }
    }

    return (
      <div className="main-content">
        <BigCalendar
          events={myEvents}
          onNavigate={this.navigate}
          onSelectEvent={(event) => console.log(event)}
        />
      </div>
    );
  }
}

export default Upcoming;
