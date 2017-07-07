import React from 'react';
import PropTypes from 'prop-types';
import { Nav, NavItem, PageHeader, Row, Button, Tab } from 'react-bootstrap';
import moment from 'moment';
import { Route, Redirect } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';


import Place from './localGuideTabs/Place';

import { blogID } from './data/options';


class LocalGuide extends React.Component {
  static propTypes = {
    data: PropTypes.array.isRequired,
    user: PropTypes.object.isRequired,
    getData: PropTypes.func.isRequired,
    deleteData: PropTypes.func.isRequired,
    updateState: PropTypes.func.isRequired,
    modalDelete: PropTypes.bool.isRequired
  }

  constructor(props){
    super(props);
    this.state = {
      categories: []
    }
  }

  componentDidMount(){
    this.props.getData(`/page/${blogID}/localGuide`, "localGuide");
  }

  componentDidUpdate(){
    //make sure data is defined
    if(this.props.data[0]){
      //make sure data is fetched and categories is not already intialiazed
      if(this.props.data[0]["category"] !== undefined && this.state.categories.length === 0){
        let cat = [];
        this.props.data.forEach((event, index) => {
            let create = {
              "title": event.category,
              "link": `/local-guide/${event.category.trim().replace(/\s/g, "-")}`
            };

            const titles = cat.map((c) => c.title);

            if (titles.indexOf(create.title) === -1) cat.push({...create, data: [event]});
            else cat[titles.indexOf(create.title)]["data"].push(event);
          });

        this.setState({categories: cat})
      }
    }
  }

  render(){
    //component already determined data is defined and correct data is fetched
    //create tabs from categories
    const tabs = (this.state.categories.length === 0) ?
      <div>Loading</div> :
      this.state.categories.map((c, index) => (
        <LinkContainer to={c.link} key={c.link}>
          <NavItem className="tab">{c.title}</NavItem>
        </LinkContainer>
      ));

    const defaultRoute = (this.state.categories.length === 0) ?
       <div></div>:
       <Route exact path="/local-guide/" render={ () =>
         <Redirect to={this.state.categories[0]["link"]} /> }
       />;

    const routes = (this.state.categories.length === 0) ?
      <div></div> :
      this.state.categories.map((c, index) => (
        <Route path={c.link} key={c.title} render={ () =>
          <Place
            data={c.data}
            user={this.props.user}
            deleteData={this.props.deleteData}
            updateState={this.props.updateState}
            length={this.props.data.length}
            modalDelete={this.props.modalDelete}
          /> }
        />
      ));

    return (
      <div className="main-content">
        <PageHeader>Local Guide</PageHeader>
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

export default LocalGuide;
