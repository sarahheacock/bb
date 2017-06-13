import React from 'react';
import PropTypes from 'prop-types';
import { PageHeader, Button } from 'react-bootstrap';
import moment from 'moment';
import EditModal from './modals/EditModal';

class Publications extends React.Component {
  static propTypes = {
    data: PropTypes.array.isRequired,
    fetchBlog: PropTypes.func.isRequired,
    admin: PropTypes.object.isRequired,
    selectEdit: PropTypes.func.isRequired,
    deleteBlog: PropTypes.func.isRequired,
    selectAdd: PropTypes.func.isRequired
  }

  componentDidMount(){
    this.props.fetchBlog("publications");
  }


  render(){

    const pubs = (this.props.data === undefined) ?
      <div>Loading</div> :
      this.props.data.map((article, index) => (
        <div key={`article${index}`}>
          <a href="#" onClick={(e) => { if(e && this.props.admin.admin) e.preventDefault(); else window.open(article.link)}}>
            {(article.authors === undefined) ?
              <div>Loading</div>:
              <div className="content">
                <div className="well well-option">
                  <h3>{article.title}</h3>
                  <p>{article.description}</p>
                  <p><b>{(Array.isArray(article.authors)) ? article.authors.join(', ') : article.authors}</b></p>
                  <p><b>{moment(article.date).format('LL')}</b></p>
                  <div className="text-center">
                    {(this.props.admin.admin) ?
                      <div>
                        <Button className="edit" bsStyle="info" onClick={() => this.props.selectEdit({data:article, section:"publications"})}>
                          Edit
                        </Button>
                        <Button className="edit" bsStyle="danger" onClick={() => {
                          if(this.props.data.length > 1) this.props.deleteBlog({sectionID:article._id, section:"publications", id:this.props.admin.id});
                          else alert("You cannot delete all entries. Deleting all entries will cause errors");
                        }}>
                          Delete
                        </Button>
                      </div> :
                      <div></div>}
                  </div>
                </div>
              </div>
            }
          </a>
        </div>

      ));
      //console.log("pub", this.props.data)

    return (
      <div className="main-content">
        <PageHeader>Publications and Presentations</PageHeader>
        {pubs}
        <div className="text-center">
          {(this.props.admin.admin) ?
          <Button className="add" bsStyle="primary" onClick={() => this.props.selectAdd({section:"publications", data:this.props.data[0]})}>
            Add
          </Button>:
          <div></div>}
        </div>
      </div>
    );
  }
}

export default Publications;
