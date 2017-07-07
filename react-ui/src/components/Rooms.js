import React from 'react';
import PropTypes from 'prop-types';
import { PageHeader, Button, Row, Col } from 'react-bootstrap';
import moment from 'moment';

import EditButton from './buttons/EditButton';
import AddButton from './buttons/AddButton';
import DeleteButton from './buttons/DeleteButton';
import DeleteModal from './modals/DeleteModal';
import { blogID, initialPage } from './data/options';

class Rooms extends React.Component {
  static propTypes = {
    data: PropTypes.array.isRequired,
    user: PropTypes.object.isRequired,
    getData: PropTypes.func.isRequired,
    deleteData: PropTypes.func.isRequired,
    updateState: PropTypes.func.isRequired,
    modalDelete: PropTypes.bool.isRequired
  }

  constructor(props){
    super(props);
    this.state = {
      target: '',
    }
  }

  componentDidMount(){
    this.props.getData(`/page/${blogID}/rooms`, "rooms");
  }

  handleSelect = (e) => {
    this.setState({
      target: e.target.name
    }, () => this.props.updateState({
      page: {
        ...initialPage,
        modalVisible: {
          ...initialPage.modalVisible,
          delete: true
        }
      }
    }));
  }

  render(){
    let pubs = <div>Loading</div>;
    let addButton = <div></div>;
    //make sure data is defined
    if(this.props.data[0]){
      //make sure correct data is fetched
      if (this.props.data[0]["carousel"]) {
        pubs = this.props.data.map((article, index) => (
            <a href="#" key={`article${index}`}>
              <div className="well">
                <div className="content">

                  <Row className="clearfix">
                    <Col className="text-center" sm={7}>
                      <h3>{article.title}</h3>
                      <p>{article.bold}</p>
                    </Col>
                    <Col className="text-center" sm={5}>
                      <img src={article.image}/>
                    </Col>
                  </Row>

                  <div className="text-center">
                    <EditButton
                      updateState={this.props.updateState}
                      admin={this.props.user.admin}
                      pageSection="rooms"
                      dataObj={article}
                    />
                    <DeleteButton
                      handleClick={this.handleSelect}
                      name={article._id}
                      user={this.props.user}
                    />
                  </div>

                  </div>
                </div>
              </a>
            ));

        addButton = <AddButton
                      updateState={this.props.updateState}
                      admin={this.props.user.admin}
                      pageSection="rooms"
                      dataObj={this.props.data[0]}
                    />;
      }
    }

    //<Button onClick={this.handleSelect} name={event._id}>Delete</Button>
    return (
      <div className="main-content">
        <PageHeader>Rooms</PageHeader>
        <div>
          {pubs}
          {addButton}
        </div>
        <DeleteModal
          user={this.props.user}
          deleteData={this.props.deleteData}
          pageSection="rooms"
          dataObjID={this.state.target}
          length={this.props.data.length}
          modalDelete={this.props.modalDelete}
        />
      </div>
    );
  }
}

export default Rooms;
