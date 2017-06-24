import React from 'react';
import PropTypes from 'prop-types';
import { Nav, NavItem, Tab, Row, Col, PageHeader, Button } from 'react-bootstrap';
import { Route, Redirect } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';

class WelcomeAdmin extends React.Component {
  static propTypes = {
    data: PropTypes.array.isRequired,
    admin: PropTypes.object.isRequired,
    logout: PropTypes.func.isRequired
  }

  componentDidMount(){
    //this.props.fetchBlog("home");
  }


  let tabs = <div>Loading</div>;
  let defaultRoute = <div></div>;
  let routes = <div></div>;

  //create tabs from categories
  //make sure data is defined
  if(this.props.data[1]){
    //make sure aboutTabs are initialized
    tabs = (this.state.aboutTabs.length === 0 && this.props.data[1]["title"] !== undefined) ?
      <div>Loading</div> :
      this.state.aboutTabs.map((c, index) => (
        <LinkContainer to={c.link}>
          <NavItem className="tab">{c.title}</NavItem>
        </LinkContainer>
      ));

    defaultRoute = (this.state.aboutTabs.length === 0 && this.props.data[1]["title"] !== undefined) ?
       <div></div>:
       <Route exact path="/about/" render={ () =>
         <Redirect to={this.state.aboutTabs[0]["link"]} /> }
       />;

    routes = (this.state.aboutTabs.length === 0 && this.props.data[1]["title"] !== undefined) ?
      <div></div> :
      this.state.aboutTabs.map((c, index) => (
        <Route path={c.link} render={ () =>
          <Nancy
            data={c.data}
            admin={this.props.admin}
            selectEdit={this.props.selectEdit}
          /> }
        />
      ));
  }

  return (
    <div className="main-content">
      <PageHeader>About Us</PageHeader>
      <div>

        </div>
    </div>
  );

  render(){

    return (
      <div className="main-content">
        <PageHeader>{`Welcome admin, ${this.props.admin.username}`}</PageHeader>
        <div className="text-center">
        <Tab.Container id="left-tabs-example" defaultActiveKey="first">
          <Row className="clearfix">
            <Nav bsStyle="tabs">
              <LinkContainer to={c.link}>
                <NavItem className="tab">{c.title}</NavItem>
              </LinkContainer>
              <LinkContainer to={c.link}>
                <NavItem className="tab">{c.title}</NavItem>
              </LinkContainer>
            </Nav>

            <Route exact path="/welcome" render={ () =>
              <Redirect to="/welcome/" /> }
            />
            <Route path={c.link} render={ () =>
              <Nancy
                data={c.data}
                admin={this.props.admin}
                selectEdit={this.props.selectEdit}
              /> }
            />
            <Route path={c.link} render={ () =>
              <Nancy
                data={c.data}
                admin={this.props.admin}
                selectEdit={this.props.selectEdit}
              /> }
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
