import React from 'react';
import PropTypes from 'prop-types';
import { Col, Row, Button } from 'react-bootstrap';
import moment from 'moment';

import { blogID, initialPage } from '../data/options';


class Place extends React.Component {
  static propTypes = {
    data: PropTypes.array.isRequired,
    user: PropTypes.object.isRequired,
    updateState: PropTypes.func.isRequired,
    deleteData: PropTypes.func.isRequired
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
                {(this.props.user.admin) ?
                  <div>
                  <Button className="edit" bsStyle="info" onClick={() => this.props.selectEdit({data:event, section:"localGuide", id:this.props.admin.id})}>
                    Edit
                  </Button>
                  <Button className="edit" bsStyle="danger" onClick={() => {
                    if(this.props.data.length > 1) this.props.deleteData(`/api/admin/${blogID}/page/${this.props.page.page}/${this.props.page.edit._id}?token=${this.props.user.token}`);
                    else alert("You cannot delete all entries. Deleting all entries will cause errors.");
                  }}>
                    Delete
                  </Button>
                  </div> :
                  <div></div>}
              </div>
              <hr />
            </div>
          </div>
        ));

        addButton = (this.props.user.admin) ?
          <Button className="add" bsStyle="primary" onClick={() => this.props.selectAdd({section:"localGuide", data:this.props.data[0]})}>
            Add
          </Button>:
          <div></div>
      }
    }


    return (
      <div className="content">
        {events}
        <div className="text-center">
          {addButton}
        </div>
      </div>
    );
  }
}

export default Place;
