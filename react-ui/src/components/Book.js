import React from 'react';
import PropTypes from 'prop-types';
import { PageHeader, Carousel, Button } from 'react-bootstrap';
import EditModal from './modals/EditModal';

class Book extends React.Component {
  static propTypes = {
    data: PropTypes.array.isRequired,
    fetchBlog: PropTypes.func.isRequired,
    admin: PropTypes.object.isRequired,
    selectEdit: PropTypes.func.isRequired
  }

  // componentDidMount(){
  //
  // }

  render(){

    return (
      <div>
            <PageHeader>Book</PageHeader>
      </div>
    );
  }
}

export default Book;
