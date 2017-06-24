import React from 'react';
import PropTypes from 'prop-types';
import { Nav, NavItem, Tab, Row, Col, PageHeader, Button } from 'react-bootstrap';
import { Route, Redirect } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';

import Upcoming from './welcomeTabs/Upcoming';
import GuestDirectory from './welcomeTabs/GuestDirectory';

class WelcomeAdmin extends React.Component {
  static propTypes = {
    data: PropTypes.array.isRequired,
    admin: PropTypes.object.isRequired,
    logout: PropTypes.func.isRequired
  }

  componentDidMount(){
    //this.props.fetchBlog("home");
  }

  render(){

    return (
      <div className="main-content">
        <PageHeader>{`Welcome admin, ${this.props.admin.username}`}</PageHeader>
        <div className="text-center">
        <Tab.Container id="left-tabs-example" defaultActiveKey="first">
          <Row className="clearfix">

            <Nav bsStyle="tabs">
              <LinkContainer to="/welcome/upcoming">
                <NavItem className="tab">Upcoming Guest Stays</NavItem>
              </LinkContainer>
              <LinkContainer to="/welcome/guest-directory">
                <NavItem className="tab">Guest Directory</NavItem>
              </LinkContainer>
            </Nav>

            <Route exact path="/welcome" render={ () =>
              <Redirect to="/welcome/upcoming" /> }
            />
            <Route path="/welcome/upcoming" render={ () =>
              <Upcoming
              />}
            />
            <Route path="/welcome/guest-directory" render={ () =>
              <GuestDirectory
              />}
            />

          </Row>
        </Tab.Container>
          <Button bsStyle="primary" onClick={() => this.props.logout("You are logged out.")}>
            Logout
          </Button>
        </div>
      </div>
    );
  }
}

export default WelcomeAdmin;
