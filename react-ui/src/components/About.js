import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';
import { Nav, NavItem, Tab, Row, Col, PageHeader } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import Nancy from './aboutTabs/Nancy';


class About extends React.Component {
  static propTypes = {
    data: PropTypes.array.isRequired,
    fetchBlog: PropTypes.func.isRequired,
    admin: PropTypes.object.isRequired,
    selectEdit: PropTypes.func.isRequired
  }

  constructor(props){
    super(props);
    this.state = {
      aboutTabs: []
    }
  }

  componentDidMount(){
    this.props.fetchBlog("about");
  }

  componentDidUpdate(){
    //make sure data is defined
    if(this.props.data[0] !== undefined && this.state.aboutTabs.length === 0){
      //make sure it is the correct data
      if(this.props.data[1]["title"]){
        let cat = [];
        this.props.data.forEach((event, index) => {
            let create = {
              "title": event.title,
              "link": `/about/${event.title.trim().replace(/\s/g, "-")}`,
              "data": event
            };

            cat.push(create);
          });

        this.setState({aboutTabs: cat})
      }
    }
  }

  render(){
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
          <Tab.Container id="left-tabs-example" defaultActiveKey="first">
          <Row className="clearfix">

              <Nav bsStyle="tabs">
                {tabs}
              </Nav>

              {defaultRoute}
              {routes}

          </Row>
          </Tab.Container>
          </div>
      </div>
    );
  }
}


export default About;
