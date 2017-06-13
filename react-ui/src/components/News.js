import React from 'react';
import PropTypes from 'prop-types';
import { PageHeader, Col, Row, Button } from 'react-bootstrap';
import moment from 'moment';

class News extends React.Component {
  static propTypes = {
    data: PropTypes.array.isRequired,
    fetchBlog: PropTypes.func.isRequired,
    admin: PropTypes.object.isRequired,
    selectEdit: PropTypes.func.isRequired,
    deleteBlog: PropTypes.func.isRequired,
    selectAdd: PropTypes.func.isRequired
  }

  componentDidMount(){
    this.props.fetchBlog("news");
  }

  render(){
    const events = (this.props.data === undefined) ?
      <div>Loading</div> :
      this.props.data.map((event, index) => (
        <div key={`news${index}`}>
          <div className="content">
            <Row className="clearfix">
              <h3>{event.title}</h3>
              <Row className="clearfix">
                <Col sm={9}>
                  <p>{event.description}</p>
                  <p><b>{moment(event.createdAt).format('LL')}</b></p>
                </Col>
                <Col sm={3}>
                  <img src={event.image}/>
                </Col>
              </Row>

            </Row>
            <div className="text-center">
              {(this.props.admin.admin) ?
                <div>
                <Button className="edit" bsStyle="info" onClick={() => this.props.selectEdit({data:event, section:"news", id:this.props.admin.id})}>
                  Edit
                </Button>
                <Button className="edit" bsStyle="danger" onClick={() => {
                  if(this.props.data.length > 1) this.props.deleteBlog({sectionID:event._id, section:"news"});
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

    return (
      <div className="main-content">
        <PageHeader>News and Events</PageHeader>
        {events}
        <div className="text-center">
          {(this.props.admin.admin) ?
          <Button className="add" bsStyle="primary" onClick={() => this.props.selectAdd({section:"news", data:this.props.data[0]})}>
            Add
          </Button>:
          <div></div>}
        </div>
      </div>
    );
  }
}

export default News;
