import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect, NavLink } from 'react-router-dom';
import { PageHeader } from 'react-bootstrap';

class Confirmation extends React.Component {
  static propTypes = {
    data: PropTypes.array.isRequired,
    // fetchBlog: PropTypes.func.isRequired,
    // admin: PropTypes.object.isRequired,
    // selectEdit: PropTypes.func.isRequired,
    //fetchSearch: PropTypes.func.isRequired,
    //select: PropTypes.object.isRequired
  }

  // componentDidMount(){
  //   this.props.fetchSearch(this.props.select);
  // }

  render(){

    return (
      <div className="main-content">



      </div>

    );
  }
}

export default Confirmation;
