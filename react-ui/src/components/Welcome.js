import React from 'react';
import PropTypes from 'prop-types';
import { PageHeader, Button, Row, Col, Modal, Alert } from 'react-bootstrap';
import moment from 'moment';

import { initialPage, initialUser } from './data/options';
import EditModal from './modals/EditModal';
import LogoutButton from './buttons/LogoutButton';


class Welcome extends React.Component {
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
    this.state = {
      target: ''
    }
  }

  componentDidMount(){
    this.props.getData(`/locked/user/${this.props.user.id}/all?token=${this.props.user.token}`);
  }

  // componentDidUpdate(prevProps, prevState){
  //   if(this.props.data[0]){
  //     if(this.props)
  //     if(this.props.data[0]["upcoming"]){
  //       if(this.props.data[0]["upcoming"].length !== prevProps.data[0]["upcoming"].length){
  //         this.state.data = this.props.data;
  //         this.setState(this.state);
  //       }
  //     }
  //   }
  // }
  handleSelect = (e) => {
    this.setState({
      target: e.target.name
    }, () => this.props.updateState({
      page: {
        ...initialPage,
        edit: true
      }
    }));
  }



  render(){
    let upcoming = <div>Loading</div>;
    if(this.props.data[0]){
      if(this.props.data[0]["upcoming"]){
        upcoming = (this.props.data[0]["upcoming"].length === 0) ?
          <div><p>You currently have no upcoming stays.</p><hr /></div> :
          this.props.data[0]["upcoming"].map((u) => (
            <div key={u._id}>
              <Row className="clearfix">
                <Col className="text-center" sm={5}>
                  <img src={u.event.roomID.image} />
                </Col>
                <Col className="text-center" sm={7}>
                  <h3>{u.event.roomID.title}</h3>
                  <p><b>Arrive: </b>{moment(u.start).format('LLLL')}</p>
                  <p><b>Depart: </b>{moment(u.end + (5*60*60*1000)).format('LLLL')}</p>
                  <p><b>Reserved On: </b>{moment(u.event.createdAt).format('LLLL')}</p>
                  <p><b>Guests: </b>{u.event.guests}</p>
                  <Button onClick={this.handleSelect} name={u._id}>Cancel Reservation</Button>
                </Col>
              </Row>
              <hr />
            </div>
          ));
      }
    }


    console.log(this.props.data);
    return (
      <div className="main-content">
        <PageHeader>{`Welcome, ${this.props.user.username}`}</PageHeader>
        <div className="text-center">
          <h2>Upcoming Stays</h2>
          <LogoutButton
            updateState={this.props.updateState}
          />
          <hr />
          {upcoming}
        </div>

        <EditModal
          user={this.props.user}
          modalEdit={this.props.page.edit}
          editData={this.props.refundClient}
          updateState={this.props.updateState}
          url={(this.props.data[0]) ? `/locked/user/${this.props.user.id}/${this.state.target._id}?token=${this.props.user.token}` : ''}
          next="#"
          dataObj={ {...this.state.target, modalTitle: "Cancel Reservation", length: 2} }
          message={this.props.message}
        />
      </div>
    );
  }
}

export default Welcome;
