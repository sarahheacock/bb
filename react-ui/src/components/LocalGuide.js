import React from 'react';
import PropTypes from 'prop-types';
import { Nav, NavItem, PageHeader, Row, Button, Tab } from 'react-bootstrap';
import moment from 'moment';
import { Route, Redirect } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';


import Place from './localGuideTabs/Place';
import AddButton from './buttons/AddButton';
import EditDeleteButtons from './buttons/EditDeleteButtons';
import DeleteModal from './modals/DeleteModal';
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
      //categories: [],
      target: {}
    }
  }

  componentDidMount(){
    this.props.getData(`/page/${blogID}/localGuide`, "localGuide");
  }

  // componentDidUpdate(){
  //   //make sure data is defined
  //
  // }

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
    let addButton = <div></div>;

    if(this.props.data[0]){
      //make sure data is fetched and categories is not already intialiazed
      if(this.props.data[0]["category"]){
        let cat = [];
        let count = -1;
        this.props.data.forEach((event, index) => {
            // let create = {
            //   "title": event.category,
            //   "link": `/local-guide/${event.category.trim().replace(/\s/g, "-")}`
            // };

            const titles = cat.map((c) => c.title);
            const titleIndex = titles.indexOf(event.category);

            if (titleIndex === -1){
              cat.push({
                "title": event.category,
                "link": `/local-guide/${event.category.trim().replace(/\s/g, "-")}`,
                data: [event]
              });
              count++;
            }
            else {
              cat[titleIndex]["data"].push(event);
              count++;
            }

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
                  <Route path={c.link} key={c.title} render={ () =>
                    <div>
                    {c.data.map((cdata, j) => (
                      <div key={`${cdata.title}j`}>
                        <Place
                          data={cdata}
                          user={this.props.user}
                          updateState={this.props.updateState}
                        />
                        <EditDeleteButtons
                          handleClick={this.handleSelect}
                          name={JSON.stringify(cdata)}
                          user={this.props.user}
                          updateState={this.props.updateState}
                        />
                        <hr />
                      </div>
                    ))}
                    </div>}
                  />
                ));

              addButton = <AddButton
                            updateState={this.props.updateState}
                            admin={this.props.user.admin}
                            pageSection="rooms"
                            dataObj={this.props.data[0]}
                          />;
            }
          });
      }
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
          <DeleteModal
            user={this.props.user}
            deleteData={this.props.deleteData}
            pageSection="localGuide"
            dataObjID={this.state.target._id}
            length={this.props.data.length}
            modalDelete={this.props.page.modalVisible.delete}
            message={this.props.message}
            updateState={this.props.updateState}
          />
          <EditModal
            user={this.props.user}
            modalEdit={this.props.page.modalVisible.edit}
            editData={this.props.putData}
            updateState={this.props.updateState}
            url={`/api/admin/${blogID}/page/localGuide/${this.state.target._id}`}
            next="#"
            dataObj={this.state.target}
            message={this.props.message}
          />
      </div>
    );
  }
}

export default LocalGuide;
