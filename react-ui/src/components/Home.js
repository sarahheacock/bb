import React from 'react';
import PropTypes from 'prop-types';
import { PageHeader, Carousel, Button } from 'react-bootstrap';
import EditModal from './modals/EditModal';

class Home extends React.Component {
  static propTypes = {
    data: PropTypes.array.isRequired,
    fetchBlog: PropTypes.func.isRequired,
    admin: PropTypes.object.isRequired,
    selectEdit: PropTypes.func.isRequired
  }

  componentDidMount(){
    this.props.fetchBlog("home")
  }

  render(){
    const homeImg = this.props.data[0];
    const carouselImg = (homeImg === undefined) ?
      <div>loading</div>:
      (homeImg["carousel"] === undefined) ?
        <div>Loading</div>:
        homeImg["carousel"].map((image, index) => (
          <Carousel.Item key={image}>
            <img className="carouselImg" alt="900x300" src={image}/>
          </Carousel.Item>
        ));
    const editButton = (this.props.admin.admin) ?
      <Button bsStyle="info" onClick={() => this.props.selectEdit({data:this.props.data[0], section:"home"})}>
        Edit
      </Button> :
      <div></div>;

    return (
      <div>
        <header>
          <Carousel className="carousel-content">
            {carouselImg}
          </Carousel>
        </header>
        <div className="lower-content">
          <div className="main-content">
            <PageHeader>Home</PageHeader>
            <div className="content">
              {(this.props.data[0] === undefined) ? <p>Loading</p> : <p className="summary">{this.props.data[0]["summary"]}</p>}
              <div className="text-center">
                {editButton}
              </div>
            </div>

          </div>
        </div>
      </div>
    );
  }
}

export default Home;
