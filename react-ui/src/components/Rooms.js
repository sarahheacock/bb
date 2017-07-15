import React from 'react';
import PropTypes from 'prop-types';
import { PageHeader, Button, Row, Col } from 'react-bootstrap';
import moment from 'moment';

import EditButton from './buttons/EditButton';
import { blogID } from './data/options';

class Rooms extends React.Component {
  static propTypes = {
    data: PropTypes.array.isRequired,
    user: PropTypes.object.isRequired,

    getData: PropTypes.func.isRequired,
    updateState: PropTypes.func.isRequired
  }

  componentDidMount(){
    this.props.getData(`/page/${blogID}/rooms`);
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
                        user={this.props.user}
                        updateState={this.props.updateState}
                        dataObj={article}
                        title="Edit"
                        pageSection="rooms"
                        length={this.props.data.length}
                      />
                    </Col>
                    <Col sm={1}>
                      <EditButton
                        user={this.props.user}
                        updateState={this.props.updateState}
                        dataObj={article}
                        title="Delete"
                        pageSection="rooms"
                        length={this.props.data.length}
                      />
                    </Col>
                  </Row>

                  </div>
                </div>
              </a>
            ));

        addButton = <EditButton
          user={this.props.user}
          updateState={this.props.updateState}
          dataObj={this.props.data[0]}
          title="Add"
          pageSection="rooms"
          length={this.props.data.length}
        />;
      }
    }


    return (
      <div className="main-content">
        <PageHeader>Rooms</PageHeader>
        <div>
          {pubs}
          {addButton}
        </div>

      </div>
    );
  }
}

export default Rooms;
