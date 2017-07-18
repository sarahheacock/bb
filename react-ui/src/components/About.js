import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';
import { Nav, NavItem, Tab, Row, Col, PageHeader } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import EditButton from './buttons/EditButton';
import Nancy from './aboutTabs/Nancy';
import { blogID } from './data/options';


class About extends React.Component {
  static propTypes = {
    data: PropTypes.array.isRequired,
    user: PropTypes.object.isRequired,

    getData: PropTypes.func.isRequired,
    updateState: PropTypes.func.isRequired
  }


  componentDidMount(){
    this.props.getData(`/page/${blogID}/about`);
  }


  render(){
    let tabs = <div>Loading</div>;
    let defaultRoute = <div></div>;
    let routes = <div></div>;

    //create tabs from categories
    //make sure data is defined
    if(this.props.data[0]){
      if(this.props.data[0]["title"] && this.props.data[0]["category"] === undefined){
        let cat = [];
        this.props.data.forEach((event, index) => {
            let create = {
              "title": event.title,
              "link": `/about/${event.title.trim().replace(/\s/g, "-")}`,
              "data": event
            };

            cat.push(create);
            if(cat.length === index + 1 && index > 0){
              //make sure aboutTabs are initialized
              tabs = cat.map((c, index) => (
                  <LinkContainer key={`${c.title}link${index}`} to={c.link}>
                    <NavItem className="tab">{c.title}</NavItem>
                  </LinkContainer>
                ));

              defaultRoute = <Route exact path="/about/" render={ () =>
                   <Redirect to={cat[0]["link"]} /> }
                 />;

              routes = cat.map((c, index) => (
                  <Route key={`${c.data._id}`} path={c.link} render={ () =>
                    <div>
                      <Nancy
                        data={c.data}
                        user={this.props.user}
                        updateState={this.props.updateState}
                      />
                      <EditButton
                        user={this.props.user}
                        updateState={this.props.updateState}
                        dataObj={c.data}
                        title="Edit"
                        pageSection="about"
                        length={this.props.data.length}
                      />
                    </div>}
                  />
                ));
            }
          });
      }
    }

    //since the only button available is Edit, url and editing function are predetermined
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
