import React from 'react';
import PropTypes from 'prop-types';
import { PageHeader, Button, Row, Col, Modal, Alert } from 'react-bootstrap';
import moment from 'moment';

class Welcome extends React.Component {
  static propTypes = {
    data: PropTypes.array.isRequired,
    admin: PropTypes.object.isRequired,
    logout: PropTypes.func.isRequired,
    fetchClient: PropTypes.func.isRequired,
    refundClient: PropTypes.func.isRequired,
    makeModal: PropTypes.func.isRequired,
    modalVisible: PropTypes.object.isRequired,
    errorMessage: PropTypes.object.isRequired
  }

  constructor(props){
    super(props);
    this.state = {
      target: ''
    }
  }

  componentDidMount(){
    this.props.fetchClient(`/locked/user/${this.props.admin.user}/detail/?token=${this.props.admin.id}`);
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
    }, () => this.props.makeModal({client: true}));
  }

  handleCancel = (e) => {
    this.props.refundClient({
      admin: this.props.admin,
      upcomingID: this.state.target
    });

    if (Object.keys(this.props.errorMessage).length === 0){
      this.props.makeModal({client: false})
    }
  }

  render(){
    let upcoming = <div>Loading</div>;
    if(this.props.data[0]){
      if(this.props.data[0]["user"]){
        upcoming = (this.props.data[0]["user"]["upcoming"].length === 0) ?
          <div><p>You currently have no upcoming stays.</p><hr /></div> :
          this.props.data[0]["upcomingDetail"].map((u) => (
            <div>
              <Row className="clearfix">
                <Col className="text-center" sm={5}>
                  <img src={u.where.image} />
                </Col>
                <Col className="text-center" sm={7}>
                  <h3>{u.where.title}</h3>
                  <p><b>Arrive: </b>{moment(u.when.start).format('LLLL')}</p>
                  <p><b>Depart: </b>{moment(u.when.end + (5*60*60*1000)).format('LLLL')}</p>
                  <p><b>Reserved On: </b>{moment(u.when.event.createdAt).format('LLLL')}</p>
                  <p><b>Guests: </b>{u.when.event.guests}</p>
                  <Button onClick={this.handleSelect} name={u.when._id}>Cancel Reservation</Button>
                </Col>
              </Row>
              <hr />
            </div>
          ));
      }
    }

    const alert = (Object.keys(this.props.errorMessage).length !== 0) ?
      <Alert className="content text-center alertMessage" bsStyle="warning">{this.props.errorMessage.error}</Alert> :
      <div></div>;


    console.log(this.props.data);
    return (
      <div className="main-content">
        <PageHeader>{`Welcome, ${this.props.admin.username}`}</PageHeader>
        <div className="text-center">
          <h2>Upcoming Stays</h2>
          <Button bsStyle="primary" onClick={() => this.props.logout("You are logged out.")}>
            Logout
          </Button>
          <hr />
          {upcoming}
        </div>

        <Modal show={this.props.modalVisible.client} >
          <Modal.Body>
            <div className="text-center">Are you sure you would like to cancel your reservation?</div>
            {alert}
          </Modal.Body>
          <Modal.Footer>
            <div className="text-center">
              <Button bsStyle="danger" onClick={this.handleCancel}>
                Cancel Reservation
              </Button>
              <Button onClick={() => this.props.makeModal({client: false})}>
                Close
              </Button>
            </div>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default Welcome;
