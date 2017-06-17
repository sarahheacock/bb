// import React from 'react';
// import PropTypes from 'prop-types';
// import { Route, Redirect } from 'react-router-dom';
// import { Nav, NavItem, Tab, Row, Col, PageHeader } from 'react-bootstrap';
// import { LinkContainer } from 'react-router-bootstrap';

//import '../stylesheets/book.css';

//components
// import Available from './bookTabs/Available';
// import Payment from './bookTabs/Payment';
// import Confirmation from './bookTabs/Confirmation';

//holds routes and onther navbar
//if room.room = false, Payment redirects to Available
//if room.room = false or login.login = false, Confirmation redirects to Payment
// const Book = (props) => {
//   return (
//     <div className="main-content">
//     <PageHeader>Book Now</PageHeader>
//     <div className="text-center">
//       <Tab.Container id="left-tabs-example" defaultActiveKey="first">
//       <Row className="clearfix">
//
//         <Col sm={4}>
//           <Nav bsStyle="pills" stacked>
//             <LinkContainer to="/book/availability">
//               <NavItem className="tab">Availability</NavItem>
//             </LinkContainer>
//             <LinkContainer to="/book/payment">
//               <NavItem className="tab">Payment</NavItem>
//             </LinkContainer>
//             <LinkContainer to="/book/confirmation">
//               <NavItem className="tab">Confirmation</NavItem>
//             </LinkContainer>
//           </Nav>
//         </Col>
//
//         <Col sm={8}>
//           <Route exact path="/book/" render={ () =>
//             <Redirect to="/book/availability" /> }
//           />
//           <Route path="/book/availability/" render={ () =>
//             <Available
//               room={props.room}
//               updateRoom={props.updateRoom}
//               searchResults={props.searchResults}
//               fetchSearch={props.fetchSearch}
//             /> }
//           />
//
//           <Route path="/book/payment" render={ () => (props.room.room) ?
//             <Payment
//               room={props.room}
//               login={props.login}
//               fetchUser={props.fetchUser}
//               updateUser={props.updateUser}
//               logout={props.logout}
//
//               modalVisible={props.modalVisible}
//               makeModal={props.makeModal}
//             /> :
//             <Redirect to="/book/availability" />}
//           />
//
//           <Route path="/book/confirmation" render={ () => (props.room.room && props.login.login) ?
//             <Confirmation
//               room={props.room}
//               login={props.login}
//               chargeClient={props.chargeClient}
//               modalVisible={props.modalVisible}
//               makeModal={props.makeModal}
//             /> :
//             <Redirect to="/book/payment" /> }
//           />
//
//         </Col>
//       </Row>
//       </Tab.Container>
//       </div>
//     </div>
//   );
// };




// export default Book;
//
// Book.propTypes = {
//   chargeClient: PropTypes.func.isRequired,
//   fetchUser: PropTypes.func.isRequired,
//   updateUser: PropTypes.func.isRequired,
//   logout: PropTypes.func.isRequired,
//   login: PropTypes.object.isRequired,
//
//   updateRoom: PropTypes.func.isRequired,
//   room: PropTypes.object.isRequired,
//
//   searchResults: PropTypes.array.isRequired,
//   fetchSearch: PropTypes.func.isRequired,
//
//   makeModal: PropTypes.func.isRequired,
//   modalVisible: PropTypes.bool.isRequired,
// };


import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect} from 'react-router-dom';
import { Nav, NavItem, Tab, Row, PageHeader, Col } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import Available from './bookTabs/Available';
import Checkout from './bookTabs/Checkout';
import Payment from './bookTabs/Payment';
import Confirmation from './bookTabs/Confirmation';

import '../stylesheets/book.css';

class Book extends React.Component {
  static propTypes = {
    data: PropTypes.array.isRequired,
    // fetchBlog: PropTypes.func.isRequired,
    // admin: PropTypes.object.isRequired,
    // selectEdit: PropTypes.func.isRequired,
    fetchSearch: PropTypes.func.isRequired,
    select: PropTypes.object.isRequired,
    checkout: PropTypes.object.isRequired,
    updateCheckout: PropTypes.func.isRequired
  }



  render(){
    return (
      <div className="main-content">
        <PageHeader>Book Now</PageHeader>


        <Row className="clearfix">
        <Col sm={4}>
          <Nav bsStyle="pills" stacked>

            <LinkContainer to="/book-now/availability">
              <NavItem className="tab">I.  Check Availability</NavItem>
            </LinkContainer>
            <LinkContainer to="/book-now/billing" disabled={!(this.props.checkout.selected)}>
              <NavItem className="tab" >II.  Billing</NavItem>
            </LinkContainer>
            <LinkContainer to="/book-now/payment" disabled={!(this.props.checkout.billing)}>
              <NavItem className="tab">III.  Payment</NavItem>
            </LinkContainer>
            <LinkContainer to="/book-now/confirmation" disabled={!(this.props.checkout.payment)}>
              <NavItem className="tab">IV.  Confirmation</NavItem>
            </LinkContainer>

          </Nav>
          </Col>

          <Col sm={8}>
          <Route exact path="/book-now/" render={ () =>
            <Redirect to="/book-now/availability" /> }
          />
          <Route path="/book-now/availability/" render={ () =>
            <Available
              data={this.props.data}
              fetchSearch={this.props.fetchSearch}
              select={this.props.select}
              checkout={this.props.checkout}
              updateCheckout={this.props.updateCheckout}
            /> }
          />
          <Route path="/book-now/billing/" render={ () =>
            <Checkout

            /> }
          />
          <Route path="/book-now/payment/" render={ () =>
            <Payment

            /> }
          />
          <Route path="/book-now/confirmation/" render={ () =>
            <Confirmation

            /> }
          />
          </Col>
          </Row>


      </div>

    );
  }
}

export default Book;
