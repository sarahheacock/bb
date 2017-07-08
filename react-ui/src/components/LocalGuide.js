import React from 'react';
import PropTypes from 'prop-types';
import { Nav, NavItem, PageHeader, Row, Button, Tab, Col } from 'react-bootstrap';
import moment from 'moment';
import { Route, Redirect } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';


import Place from './localGuideTabs/Place';
import EditButton from './buttons/EditButton';
import EditModal from './modals/EditModal';
import { blogID } from './data/options';


class LocalGuide extends React.Component {
  static propTypes = {
    data: PropTypes.array.isRequired,
    user: PropTypes.object.isRequired,
    message: PropTypes.object.isRequired,
    getData: PropTypes.func.isRequired,
    putData: PropTypes.func.isRequired,
    postData: PropTypes.func.isRequired,
    deleteData: PropTypes.func.isRequired,
    updateState: PropTypes.func.isRequired,
    page: PropTypes.object.isRequired
  }

  constructor(props){
    super(props);
    this.state = {
      target: {},
      targetType: ''
    }
  }

  componentDidMount(){
    this.props.getData(`/page/${blogID}/localGuide`, "localGuide");
  }


  handleSelect = (e) => {
    this.setState({
      target: JSON.parse(e.target.name),
      targetType: e.target.value
    });
  }

  render(){
    let tabs = <div>Loading</div>;
    let defaultRoute = <div></div>;
    let routes = <div></div>;
    let addButton = <div></div>;

    //make sure data is defined
    if(this.props.data[0]){
      //make sure correct data is fetched
      if(this.props.data[0]["category"]){
        let cat = [];
        let count = -1;
        this.props.data.forEach((event, index) => {

            const titles = cat.map((c) => c.title);
            const titleIndex = titles.indexOf(event.category);

            //if tab does not already exist, create it
            if (titleIndex === -1){
              cat.push({
                "title": event.category,
                "link": `/local-guide/${event.category.trim().replace(/\s/g, "-")}`,
                data: [event]
              });
              count++;
            }
            else { //if tab exists, push data into it
              cat[titleIndex]["data"].push(event);
              count++;
            }

            //if done iterating through the data array
            if(count === index){
              tabs = cat.map((c, index) => (
                  <LinkContainer to={c.link} key={c.link}>
                    <NavItem className="tab">{c.title}</NavItem>
                  </LinkContainer>
                ));

              defaultRoute = <Route exact path="/local-guide/" render={ () =>
                   <Redirect to={cat[0]["link"]} /> }
                 />;

              routes = cat.map((c, index) => (
                  <Route path={c.link} key={`${c.title}route${index}`} render={ () =>
                    <div>
                    {c.data.map((cdata, j) => (
                      <div key={`${cdata.title}place${j}`}>
                        <Place
                          data={cdata}
                          user={this.props.user}
                          updateState={this.props.updateState}
                        />
                        <Row>
                          <Col sm={1}>
                            <EditButton
                              handleSelect={this.handleSelect}
                              admin={this.props.user.admin}
                              updateState={this.props.updateState}
                              name={cdata}
                              title="Edit"
                            />
                          </Col>
                          <Col sm={1}>
                            <EditButton
                              handleSelect={this.handleSelect}
                              admin={this.props.user.admin}
                              updateState={this.props.updateState}
                              name={cdata}
                              title="Delete"
                            />
                          </Col>
                        </Row>
                        <hr />
                      </div>
                    ))}
                    </div>}
                  />
                ));

                addButton = <EditButton
                              handleSelect={this.handleSelect}
                              admin={this.props.user.admin}
                              updateState={this.props.updateState}
                              name={this.props.data[0]}
                              title="Add"
                            />;
            }
          });
      }
    }

    let url = `/api/admin/${blogID}/page/localGuide`;
    let editFunc = this.props.postData;

    if(this.state.targetType === "Edit" && this.state.target._id !== 'undefined'){
      url = `/api/admin/${blogID}/page/localGuide/${this.state.target._id}`;
      editFunc = this.props.putData;
    }
    else if(this.state.targetType === "Delete" && this.state.target._id !== 'undefined'){
      url = `/api/admin/${blogID}/page/localGuide/${this.state.target._id}?token=${this.props.user.token}`;
      editFunc = this.props.deleteData;
    }

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
          {addButton}
          <EditModal
            user={this.props.user}
            modalEdit={this.props.page.edit}
            editData={editFunc}
            updateState={this.props.updateState}
            url={url}
            next="#"
            dataObj={ {...this.state.target, modalTitle: `${this.state.targetType} Content`, length: this.props.data.length} }
            message={this.props.message}
          />
      </div>
    );
  }
}

export default LocalGuide;
