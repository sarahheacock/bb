import React from 'react';
import PropTypes from 'prop-types';
import { PageHeader } from 'react-bootstrap';

class Research extends React.Component {
  static propTypes = {
    data: PropTypes.array.isRequired,
    fetchBlog: PropTypes.func.isRequired
  }

  componentDidMount(){
    this.props.fetchBlog("research")
  }

  render(){
    const res = this.props.data;
    const articles = (res === undefined) ?
      <div>loading</div>:
      res.map((article) => (
        <div key={article._id}>
          <h3>{article.title}</h3>
          <p>{article.summary}</p>
        </div>
      ));

    return (
      <div className="main-content">
        <PageHeader>Research</PageHeader>
        <div className="content">{articles}</div>
      </div>
    );
  }
}

export default Research;
