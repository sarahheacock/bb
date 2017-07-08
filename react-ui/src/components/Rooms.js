import React from 'react';
import PropTypes from 'prop-types';
import { PageHeader, Button, Row, Col } from 'react-bootstrap';
import moment from 'moment';

//import EditButton from './buttons/EditButton';
import EditButton from './buttons/EditButton';
import EditModal from './modals/EditModal';
import { blogID, initialPage } from './data/options';

class Rooms extends React.Component {
  static propTypes = {
    data: PropTypes.array.isRequired,
    user: PropTypes.object.isRequired,
    message: PropTypes.object.isRequired,
    getData: PropTypes.func.isRequired,
    putData: PropTypes.func.isRequired,
    postData: PropTypes.func.isRequired,
    deleteData: PropTypes.func.isRequired,
    updateState: PropTypes.func.isRequired,
    page: PropTypes.object.isRequired
  }

  constructor(props){
    super(props);
    this.state = {
      target: {},
      targetType: ''
    }
  }

  componentDidMount(){
    this.props.getData(`/page/${blogID}/rooms`, "rooms");
  }

  handleSelect = (e) => {
    console.log(e.target);
    this.setState({
      target: JSON.parse(e.target.name),
      targetType: e.target.value
    });
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

                  <Row>
                    <Col sm={1}>
                      <EditButton
                        handleSelect={this.handleSelect}
                        admin={this.props.user.admin}
                        updateState={this.props.updateState}
                        name={article}
                        title="Edit"
                      />
                    </Col>
                    <Col sm={1}>
                      <EditButton
                        handleSelect={this.handleSelect}
                        admin={this.props.user.admin}
                        updateState={this.props.updateState}
                        name={article}
                        title="Delete"
                      />
                    </Col>
                  </Row>

                  </div>
                </div>
              </a>
            ));

        addButton = <EditButton
                      handleSelect={this.handleSelect}
                      admin={this.props.user.admin}
                      updateState={this.props.updateState}
                      name={this.props.data[0]}
                      title="Add"
                    />;
      }
    }

    //<Button onClick={this.handleSelect} name={event._id}>Delete</Button>
    const url = (this.state.targetType === "Add" && this.state.target._id !== 'undefined') ?
      `/api/admin/${blogID}/page/rooms` :
      (
        (this.state.targetType === "Edit" && this.state.target._id !== 'undefined') ?
          `/api/admin/${blogID}/page/rooms/${this.state.target._id}`:
          `/api/admin/${blogID}/page/rooms/${this.state.target._id}?token=${this.props.user.token}`
      );


    let editFunc = this.props.putData;
    if(this.state.targetType === "Add") editFunc = this.props.postData;
    else if(this.state.targetType === "Delete") editFunc = this.props.deleteData;

    return (
      <div className="main-content">
        <PageHeader>Rooms</PageHeader>
        <div>
          {pubs}
          {addButton}
        </div>
        <EditModal
          user={this.props.user}
          modalEdit={this.props.page.modalVisible.edit}
          editData={editFunc}
          updateState={this.props.updateState}
          url={url}
          next="#"
          dataObj={ {...this.state.target, modalTitle: `${this.state.targetType} Content`, length: this.props.data.length} }
          message={this.props.message}
        />
      </div>
    );
  }
}

export default Rooms;
