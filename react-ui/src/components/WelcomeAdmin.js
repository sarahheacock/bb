import React from 'react';
import PropTypes from 'prop-types';
import { Nav, NavItem, Tab, Row, Col, PageHeader, Button } from 'react-bootstrap';
import { Route, Redirect } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';

import Upcoming from './welcomeTabs/Upcoming';
import GuestDirectory from './welcomeTabs/GuestDirectory';
import LogoutButton from './buttons/LogoutButton';

class WelcomeAdmin extends React.Component {
  static propTypes = {
    data: PropTypes.array.isRequired,
    user: PropTypes.object.isRequired,

    getData: PropTypes.func.isRequired,
    updateState: PropTypes.func.isRequired
  }


  render(){

    return (
      <div className="main-content">
        <PageHeader>{`Welcome admin, ${this.props.user.username}`}</PageHeader>
        <div className="text-center">
        <Tab.Container id="left-tabs-example" defaultActiveKey="first">
          <Row className="clearfix">

            <Nav bsStyle="tabs">
              <LinkContainer to="/welcome/upcoming">
                <NavItem className="tab">Guest Calendar</NavItem>
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
                data={this.props.data}
                user={this.props.user}

                getData={this.props.getData}
                updateState={this.props.updateState}
              />}
            />
            <Route path="/welcome/guest-directory" render={ () =>
              <GuestDirectory
              />}
            />

          </Row>
        </Tab.Container>
          <LogoutButton
            updateState={this.props.updateState}
          />
        </div>
      </div>
    );
  }
}

export default WelcomeAdmin;
