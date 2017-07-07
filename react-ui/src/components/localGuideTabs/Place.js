import React from 'react';
import PropTypes from 'prop-types';
import { Col, Row, Button } from 'react-bootstrap';
import moment from 'moment';

import EditButton from '../buttons/EditButton';
import AddButton from '../buttons/AddButton';
import DeleteModal from '../modals/DeleteModal';
import DeleteButton from '../buttons/DeleteButton';
import { blogID, initialPage } from '../data/options';


class Place extends React.Component {
  static propTypes = {
    data: PropTypes.array.isRequired,
    user: PropTypes.object.isRequired,
    updateState: PropTypes.func.isRequired,
    deleteData: PropTypes.func.isRequired,
    modalDelete: PropTypes.bool.isRequired,
    length: PropTypes.number.isRequired
  }

  constructor(props){
    super(props);
    this.state = {
      target: '',
    }
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
    //determine categories
    let categories = (this.props.data);

    //create tabs from categories

    //put data in appropiate categories
    //make sure data is defined
    let events = <div>Loading</div>;
    let addButton = <div></div>;
    if(this.props.data[0]){
      if(this.props.data[0]["address"] !== undefined && this.props.data[0]["title"] !== undefined){
        events = this.props.data.map((event, index) => (
          <div key={`localGuide${index}`}>
            <div className="content">
              <Row className="clearfix">
                <h3>{event.title}</h3>
                <Row className="clearfix">
                  <Col sm={7}>
                    <p>{event.description}</p>
                    <p><b>{event.address}</b></p>
                  </Col>
                  <Col sm={5}>
                    <img src={event.image}/>
                  </Col>
                </Row>

              </Row>
              <div className="text-center">
                <EditButton
                  updateState={this.props.updateState}
                  admin={this.props.user.admin}
                  pageSection="localGuide"
                  dataObj={event}
                />
                <DeleteButton
                  handleClick={this.handleSelect}
                  name={event._id}
                  user={this.props.user}
                />
              </div>
              <hr />
            </div>
          </div>
        ));

        addButton = <AddButton
                      updateState={this.props.updateState}
                      admin={this.props.user.admin}
                      pageSection="localGuide"
                      dataObj={this.props.data[0]}
                    />;
      }
    }


    return (
      <div className="content">
        {events}
        <div className="text-center">
          {addButton}
        </div>
        <DeleteModal
          user={this.props.user}
          deleteData={this.props.deleteData}
          pageSection="localGuide"
          dataObjID={this.state.target}
          length={this.props.length}
          modalDelete={this.props.modalDelete}
        />
      </div>
    );
  }
}

export default Place;
