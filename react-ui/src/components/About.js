import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';
import { Nav, NavItem, Tab, Row, Col, PageHeader } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import EditButton from './buttons/EditButton';
import EditModal from './modals/EditModal';
import Nancy from './aboutTabs/Nancy';
import { blogID, initialPage } from './data/options';


class About extends React.Component {
  static propTypes = {
    data: PropTypes.array.isRequired,
    user: PropTypes.object.isRequired,
    message: PropTypes.object.isRequired,
    getData: PropTypes.func.isRequired,
    putData: PropTypes.func.isRequired,
    updateState: PropTypes.func.isRequired,
    page: PropTypes.object.isRequired
  }

  constructor(props){
    super(props);
    this.state = {
      //aboutTabs: [],
      target: {}
    }
  }

  componentDidMount(){
    this.props.getData(`/page/${blogID}/about`, "about");
  }


  handleSelect = (e) => {
    //console.log("click", e.target.name);
    this.setState({
      target: JSON.parse(e.target.name)
    });
  }

  render(){
    let tabs = <div>Loading</div>;
    let defaultRoute = <div></div>;
    let routes = <div></div>;

    //create tabs from categories
    //make sure data is defined
    if(this.props.data[1]){
      if(this.props.data[1]["title"]){
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
                  <LinkContainer key={`${c.title}link`} to={c.link}>
                    <NavItem className="tab">{c.title}</NavItem>
                  </LinkContainer>
                ));

              defaultRoute = <Route exact path="/about/" render={ () =>
                   <Redirect to={cat[0]["link"]} /> }
                 />;

              routes = cat.map((c, index) => (
                  <Route key={`${c.title}route`} path={c.link} render={ () =>
                    <div>
                      <Nancy
                        data={c.data}
                        user={this.props.user}
                        updateState={this.props.updateState}
                      />
                      <EditButton
                        handleSelect={this.handleSelect}
                        admin={this.props.user.admin}
                        name={JSON.stringify(c.data)}
                        updateState={this.props.updateState}
                      />
                    </div>}
                  />
                ));
            }
          });
      }
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
          <EditModal
            user={this.props.user}
            modalEdit={this.props.page.modalVisible.edit}
            editData={this.props.putData}
            updateState={this.props.updateState}
            url={`/api/admin/${blogID}/page/about/${this.state.target._id}`}
            next="#"
            dataObj={this.state.target}
            message={this.props.message}
          />
      </div>
    );
  }
}


export default About;
