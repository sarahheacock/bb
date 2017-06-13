import React from 'react';
import PropTypes from 'prop-types';
import { PageHeader } from 'react-bootstrap';

class Fetch extends React.Component {
  static propTypes = {
    message: PropTypes.object.isRequired,
    fetching: PropTypes.bool.isRequired,
    fetchApi: PropTypes.func.isRequired,
  }

  componentWillMount(){
    this.props.fetchApi(this.props.fetching);
  }

  render(){

    return (
      <p className="App-intro">
        {this.props.fetching
          ? 'Fetching message from API'
          : this.props.message}
      </p>
    );
  }
}

export default Fetch;
