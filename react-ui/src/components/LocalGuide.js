import React from 'react';
import PropTypes from 'prop-types';
import { Nav, NavItem, PageHeader, Row, Button, Tab } from 'react-bootstrap';
import moment from 'moment';
import { Route, Redirect } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import Place from './localGuideTabs/Place';

class LocalGuide extends React.Component {
  static propTypes = {
    data: PropTypes.array.isRequired,
    fetchBlog: PropTypes.func.isRequired,
    admin: PropTypes.object.isRequired,
    selectEdit: PropTypes.func.isRequired,
    deleteBlog: PropTypes.func.isRequired,
    selectAdd: PropTypes.func.isRequired
  }

  constructor(props){
    super(props);
    this.state = {
      categories: []
    }
  }

  componentDidMount(){
    this.props.fetchBlog("localGuide");
  }

  componentDidUpdate(){
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

  render(){
    console.log(this.state.categories);

    //create tabs from categories
    const tabs = (this.state.categories.length === 0) ?
      <div>Loading</div> :
      this.state.categories.map((c, index) => (
        <LinkContainer to={c.link}>
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
        <Route path={c.link} render={ () =>
          <Place
            data={c.data}
            admin={this.props.admin}
            selectEdit={this.props.selectEdit}
            deleteBlog={this.props.deleteBlog}
            selectEdit={this.props.selectEdit}
            selectAdd={this.props.selectAdd}
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
