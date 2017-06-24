import React from 'react';
import PropTypes from 'prop-types';
import { PageHeader, Button } from 'react-bootstrap';

class Upcoming extends React.Component {
  static propTypes = {
  }

  componentDidMount(){
    //this.props.fetchBlog("home");
  }

  render(){

    return (
      <div className="main-content">
        Upcoming
      </div>
    );
  }
}

export default Upcoming;
