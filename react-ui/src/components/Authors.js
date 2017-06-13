import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';
import { Nav, NavItem, Tab, Row, Col, PageHeader } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import Nancy from './aboutTabs/Nancy';


class Authors extends React.Component {
  static propTypes = {
    data: PropTypes.array.isRequired,
    fetchBlog: PropTypes.func.isRequired,
    admin: PropTypes.object.isRequired,
    selectEdit: PropTypes.func.isRequired
  }

  componentDidMount(){
    this.props.fetchBlog("authors")
  }

  render(){
//names are sorted in API to ensure 'nancy' always comes first
    return (
      <div className="main-content">
        <PageHeader>About the Authors</PageHeader>
        <div className="text-center">
          <Tab.Container id="left-tabs-example" defaultActiveKey="first">
          <Row className="clearfix">


              <Nav bsStyle="tabs">
                <LinkContainer to="/authors/nancy">
                  <NavItem className="tab">Nancy Darr</NavItem>
                </LinkContainer>
                <LinkContainer to="/authors/mary-rose">
                  <NavItem className="tab">Mary Rose Franjoine</NavItem>
                </LinkContainer>
              </Nav>


              <Route exact path="/authors/" render={ () =>
                <Redirect to="/authors/nancy" /> }
              />
              <Route path="/authors/nancy" render={ () =>
                <Nancy
                  data={this.props.data[0]}
                  admin={this.props.admin}
                  selectEdit={this.props.selectEdit}
                /> }
              />

              <Route path="/authors/mary-rose" render={ () =>
                <Nancy
                  data={this.props.data[1]}
                  admin={this.props.admin}
                  selectEdit={this.props.selectEdit}
                /> }
              />

          </Row>
          </Tab.Container>
          </div>
      </div>
    );
  }
}


export default Authors;
