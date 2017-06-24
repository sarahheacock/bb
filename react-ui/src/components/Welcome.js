import React from 'react';
import PropTypes from 'prop-types';
import { PageHeader, Button } from 'react-bootstrap';

class Welcome extends React.Component {
  static propTypes = {
    data: PropTypes.array.isRequired,
    admin: PropTypes.object.isRequired,
    logout: PropTypes.func.isRequired,
    fetchClient: PropTypes.func.isRequired
  }

  componentDidMount(){
    this.props.fetchClient(this.props.admin);
  }

  render(){
    let upcoming = <div>Loading</div>;
    if(this.props.data[0]){
      if(this.props.data[0]["upcoming"]){
        upcoming = (this.props.data[0]["upcoming"].length === 0) ?
          <div><p>You currently have no upcoming stays.</p><hr /></div> :
          this.props.data[0]["upcoming"].map((u) => (
            <div>
              hi
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
