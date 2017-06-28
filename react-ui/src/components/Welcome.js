import React from 'react';
import PropTypes from 'prop-types';
import { PageHeader, Button, Row, Col } from 'react-bootstrap';
import moment from 'moment';

class Welcome extends React.Component {
  static propTypes = {
    data: PropTypes.array.isRequired,
    admin: PropTypes.object.isRequired,
    logout: PropTypes.func.isRequired,
    fetchClient: PropTypes.func.isRequired
  }

  componentDidMount(){
    this.props.fetchClient(`/locked/user/${this.props.admin.user}/detail/?token=${this.props.admin.id}`);
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
                  <img src={u.where.image}/>
                </Col>
                <Col className="text-center" sm={7}>
                  <h3>{u.where.title}</h3>
                  <p>{`Arrive ${moment(u.when.arrive  + (5*60*60*1000)).format('LLLL')}`}</p>
                  <p>{`Depart ${moment(u.when.depart).format('LLLL')}`}</p>
                </Col>
              </Row>
              <hr />
            </div>
          ));
      }
    }


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
      </div>
    );
  }
}

export default Welcome;
