import React from 'react';
import PropTypes from 'prop-types';
import { PageHeader, Button } from 'react-bootstrap';

class GuestDirectory extends React.Component {
  static propTypes = {
  }

  componentDidMount(){
    //this.props.fetchBlog("home");
  }

  render(){

    return (
      <div className="main-content">
        <h3>GuestDirectory</h3>
      </div>
    );
  }
}

export default GuestDirectory;
