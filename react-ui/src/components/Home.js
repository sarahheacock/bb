import React from 'react';
import PropTypes from 'prop-types';
import { PageHeader, Carousel, Button } from 'react-bootstrap';

import EditModal from './modals/EditModal';
import EditButton from './buttons/EditButton';
import { blogID, initialPage } from './data/options';

class Home extends React.Component {
  static propTypes = {
    data: PropTypes.array.isRequired,
    user: PropTypes.object.isRequired,
    message: PropTypes.object.isRequired,
    getData: PropTypes.func.isRequired,
    putData: PropTypes.func.isRequired,
    updateState: PropTypes.func.isRequired,
    page: PropTypes.object.isRequired
  }

  componentDidMount(){
    this.props.getData(`/page/${blogID}/home`, "home");
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

      editButton = <EditButton
                    handleSelect={(e) => {console.log(e.target);}}
                    admin={this.props.user.admin}
                    updateState={this.props.updateState}
                    name={this.props.data[0]}
                    title="Edit"
                  />;

      summary = (this.props.data[0]["summary"]) ?
        <p className="summary"><b>{this.props.data[0]["bold"]}</b><br /><br />{this.props.data[0]["summary"]}</p> :
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
              {editButton}
            </div>

          </div>
        </div>
        <EditModal
          user={this.props.user}
          modalEdit={this.props.page.modalVisible.edit}
          editData={this.props.putData}
          updateState={this.props.updateState}
          url={(this.props.data[0]) ? `/api/admin/${blogID}/page/home/${this.props.data[0]["_id"]}` : ''}
          next="#"
          dataObj={ {...this.props.data[0], modalTitle: "Edit Content", length: this.props.data.length} }
          message={this.props.message}
        />
      </div>
    );
  }
}

export default Home;
