import React from 'react';
import PropTypes from 'prop-types';
import { PageHeader, Carousel, Button } from 'react-bootstrap';

import { blogID, initialPage } from './data/options';

class Home extends React.Component {
  static propTypes = {
    data: PropTypes.array.isRequired,
    user: PropTypes.object.isRequired,
    page: PropTypes.object.isRequired,
    getData: PropTypes.func.isRequired,
    updateState: PropTypes.func.isRequired
  }

  componentDidMount(){
    //this.props.fetchBlog("home");
    this.props.getData(`/page/${blogID}/home`, {page: {...initialPage, page: "home"}});
  }

  render(){

    let carouselImg = <div>Loading</div>;
    let editButton = <div></div>
    let summary = <div>Loading</div>
    //make sure data is defined
    if(this.props.data[0]){
      //make sure appropiate data is fetched
      carouselImg = (this.props.data[0]["carousel"]) ?
        this.props.data[0]["carousel"].map((image, index) => (
            <Carousel.Item key={image}>
              <img className="carouselImg" alt="900x300" src={image}/>
            </Carousel.Item>
          )) :
        <Carousel.Item>Loading</Carousel.Item>;

      editButton = (this.props.user.admin) ?
        <Button bsStyle="info" onClick={() => this.props.updateState({
          page: {
            ...initialPage,
            modalVisible: {
              ...initialPage.modalVisible,
              modalTwo: true,
            },
            edit: this.props.data[0]
          }
        })}>
          Edit
        </Button> :
        <div></div>;

      summary = (this.props.data[0]["summary"]) ?
        <p className="summary">{this.props.data[0]["summary"]}</p> :
        <p>Loading</p>
    }

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
              {summary}
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
