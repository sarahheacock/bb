import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect, NavLink } from 'react-router-dom';
import { PageHeader } from 'react-bootstrap';

class Confirmation extends React.Component {
  //component will merely present provided info and create navlinks to
  //edit info along with necessary modal visibility

  //confirm button will initialize payment functions and provide modal to
  //personal profile page
  static propTypes = {
    data: PropTypes.array.isRequired,
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
