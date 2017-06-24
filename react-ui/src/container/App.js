import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import axios from 'axios';

//redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as AdminActionCreators from '../actions/admin';

//components
import Routes from './Routes';
import Header from './Header';
import Footer from './Footer';


class App extends Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
    modalVisible: PropTypes.object.isRequired,
    admin: PropTypes.object.isRequired,
    errorMessage: PropTypes.object.isRequired,
    messageSent: PropTypes.bool.isRequired,
    selectedEdit: PropTypes.object.isRequired,
    selectedAdd: PropTypes.object.isRequired,
    //searchResults: PropTypes.object.isRequired,
    select: PropTypes.object.isRequired,
    checkout: PropTypes.object.isRequired,

    newPage: PropTypes.bool.isRequired,
  }

  // constructor(props) {
  //     super(props);
  //     this.state = {
  //       message: null,
  //       fetching: true
  //     };
  //   }
  //
  //   componentDidUpdate() {
  //     if(this.props.newPage){
  //       axios.get('/')
  //         .then(json => {
  //           //console.log("json", json);
  //           this.setState({
  //             message: json,
  //             fetching: false
  //           });
  //         })
  //         .catch(e => {
  //           this.setState({
  //             message: `API call failed: ${e}`,
  //             fetching: false
  //           });
  //         })
  //       }
  //  }


  render(){
    const{ dispatch, data, modalVisible, admin, errorMessage, messageSent, selectedEdit, selectedAdd, message, newPage, searchResults, select, checkout} = this.props;
    //turns an object whose values are action creators (functions)
    //and wraps in dispatch (what causes state change)
    const makeModal = bindActionCreators(AdminActionCreators.makeModal, dispatch);
    const fetchBlog = bindActionCreators(AdminActionCreators.fetchBlog, dispatch);
    const verifyEmail = bindActionCreators(AdminActionCreators.verifyEmail, dispatch);
    const sendMessage = bindActionCreators(AdminActionCreators.sendMessage, dispatch);
    const editBlog = bindActionCreators(AdminActionCreators.editBlog, dispatch);
    const addBlog = bindActionCreators(AdminActionCreators.addBlog, dispatch);
    const deleteBlog = bindActionCreators(AdminActionCreators.deleteBlog, dispatch);
    const selectEdit = bindActionCreators(AdminActionCreators.selectEdit, dispatch);
    const selectAdd = bindActionCreators(AdminActionCreators.selectAdd, dispatch);
    const logout = bindActionCreators(AdminActionCreators.logout, dispatch);
    const fetchSearch = bindActionCreators(AdminActionCreators.fetchSearch, dispatch);
    const updateCheckout = bindActionCreators(AdminActionCreators.updateCheckout, dispatch);
    const createEmail = bindActionCreators(AdminActionCreators.createEmail, dispatch);
    const fetchClient = bindActionCreators(AdminActionCreators.fetchClient, dispatch);
    const updateEmail = bindActionCreators(AdminActionCreators.updateEmail, dispatch);
    const verifyPayment = bindActionCreators(AdminActionCreators.verifyPayment, dispatch);



    //console.log(this.state.message);
    //console.log("state", this.state);
    console.log("data", data);
    console.log("modalVisible", modalVisible);
    console.log("admin", admin);
    console.log("errorMessage", errorMessage);
    console.log("messageSent", messageSent);
    console.log("selectedEdit", selectedEdit);
    console.log("newPage", newPage);
    console.log("checkout", checkout);
    console.log("select", select);


    return (
      <BrowserRouter>
        <div className="container-fluid">

          <Header
            admin={admin}
          />

          <Routes
            fetchBlog={fetchBlog}
            data={data.current}
            admin={admin}
            selectEdit={selectEdit}
            selectAdd={selectAdd}
            deleteBlog={deleteBlog}
            errorMessage={errorMessage}
            verifyEmail={verifyEmail}
            logout={logout}
            fetchSearch={fetchSearch}
            select={select}
            checkout={checkout}
            updateCheckout={updateCheckout}
            createEmail={createEmail}
            modalVisible={modalVisible}
            makeModal={makeModal}
            fetchClient={fetchClient}
            updateEmail={updateEmail}
            verifyPayment={verifyPayment}
          />

          <Footer
            visible={modalVisible.message}
            makeModal={makeModal}
            sendMessage={sendMessage}
            messageSent={messageSent}
            editVisible={modalVisible.edit}
            selectedEdit={selectedEdit}
            selectedAdd={selectedAdd}
            editBlog={editBlog}
            errorMessage={errorMessage}
            addVisible={modalVisible.add}
            addBlog={addBlog}
            admin={admin}
          />
        </div>

      </BrowserRouter>

    );
  }
}

const mapStateToProps = state => (
  {
    data: state.data,
    admin: state.admin,
    modalVisible: state.modalVisible,
    errorMessage: state.errorMessage,
    messageSent: state.messageSent,
    selectedEdit: state.selectedEdit,
    selectedAdd: state.selectedAdd,
    //searchResults: state.searchResults,
    select: state.select,
    checkout: state.checkout,

    newPage: state.newPage

  }
);


export default connect(mapStateToProps)(App);
