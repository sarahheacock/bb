import React from 'react';
import PropTypes from 'prop-types';
import { PageHeader, Button, Row, Col } from 'react-bootstrap';
import moment from 'moment';

import { blogID, initialPage } from './data/options';

class Rooms extends React.Component {
  static propTypes = {
    data: PropTypes.array.isRequired,
    user: PropTypes.object.isRequired,
    page: PropTypes.object.isRequired,
    getData: PropTypes.func.isRequired,
    deleteData: PropTypes.func.isRequired,
    updateState: PropTypes.func.isRequired
  }

  componentDidMount(){
    this.props.getData(`/page/${blogID}/rooms`, {page: {...initialPage, page: "rooms"}});
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
                    {(this.props.user.admin) ?
                      <div>
                        <Button className="edit" bsStyle="info" onClick={() => this.props.updateState({
                          page: {
                            ...initialPage,
                            message: initialPage.message,
                            modalVisible: {
                              ...initialPage.modalVisible,
                              modalTwo: true,
                            },
                            edit: article
                          }
                        })}>
                          Edit
                        </Button>
                        <Button className="edit" bsStyle="danger" onClick={() => {
                          if(this.props.data.length > 1) this.props.deleteData(`/api/admin/${blogID}/page/${this.props.page.page}/${this.props.page.edit._id}?token=${this.props.user.token}`);
                          else alert("You cannot delete all entries. Deleting all entries will cause errors");
                        }}>
                          Delete
                        </Button>
                      </div> :
                      <div></div>}
                  </div>

                  </div>
                </div>
              </a>
            ));

        addButton = (this.props.user.admin) ?
          <Button className="add text-center" bsStyle="primary" onClick={() => this.props.updateState({
            page: {
              ...initialPage,
              modalVisible: {
                ...initialPage.modalVisible,
                modalOne: true,
              },
              edit: this.props.data[0]
            }
          })}>
            Add
          </Button>:
          <div></div>;
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
