import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect} from 'react-router-dom';
import { Nav, NavItem, Tab, Row, PageHeader, Col } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import Available from './bookTabs/Available';
import Billing from './bookTabs/Billing';
import Payment from './bookTabs/Payment';
import Confirmation from './bookTabs/Confirmation';

import '../stylesheets/book.css';

class Book extends React.Component {
  static propTypes = {
    data: PropTypes.array.isRequired,
    user: PropTypes.object.isRequired,
    checkout: PropTypes.object.isRequired,
    checkEdit: PropTypes.bool.isRequired,


    getData: PropTypes.func.isRequired,
    fetchSearch: PropTypes.func.isRequired,
    chargeClient: PropTypes.func.isRequired,

    updateState: PropTypes.func.isRequired
  }


  render(){
    const roomSelected = Object.keys(this.props.checkout.selected.roomID).length > 0 && !(!this.props.user.username);
    const billed = !(!this.props.checkout.billing.email);
    const paid = !(!this.props.checkout.payment.number);

    console.log("book roomSelected", roomSelected);
    console.log("book billed", billed);
    console.log("book paid", paid);

    return (
      <div className="main-content">
        <PageHeader>Book Now</PageHeader>

        <Row className="clearfix">
          <Col sm={4}>


            { (this.props.user.admin) ?
              <Nav bsStyle="pills" stacked>
                <LinkContainer to="/book-now/availability">
                  <NavItem className="tab">I.  Check Availability</NavItem>
                </LinkContainer>
                <LinkContainer to="/book-now/confirmation" disabled={!(roomSelected)}>
                  <NavItem className="tab">II.  Confirmation</NavItem>
                </LinkContainer>
              </Nav>:

              <Nav bsStyle="pills" stacked>
                <LinkContainer to="/book-now/availability">
                  <NavItem className="tab">I.  Check Availability</NavItem>
                </LinkContainer>
                <LinkContainer to="/book-now/billing" disabled={!(roomSelected)}>
                  <NavItem className="tab" >II.  Billing</NavItem>
                </LinkContainer>
                <LinkContainer to="/book-now/payment" disabled={!(billed)}>
                  <NavItem className="tab">III.  Payment</NavItem>
                </LinkContainer>
                <LinkContainer to="/book-now/confirmation" disabled={!(paid)}>
                  <NavItem className="tab">IV.  Confirmation</NavItem>
                </LinkContainer>
              </Nav>
            }

          </Col>



            {
              (this.props.user.admin) ?
              <Col sm={8}>
              <Route exact path="/book-now/" render={ () =>
                <Redirect to="/book-now/availability" /> }
              />
              <Route path="/book-now/availability/" render={ () =>
                <Available
                  data={this.props.data}
                  user={this.props.user}
                  checkout={this.props.checkout}

                  fetchSearch={this.props.fetchSearch}
                  updateState={this.props.updateState}
                /> }
              />
              <Route exact path="/book-now/billing" render={ () =>
                <Redirect to="/book-now/availability" /> }
              />
              <Route exact path="/book-now/payment" render={ () =>
                <Redirect to="/book-now/availability" /> }
              />
              <Route path="/book-now/confirmation/" render={ () => (roomSelected) ?
                <Confirmation
                  data={this.props.data}
                  user={this.props.user}
                  checkout={this.props.checkout}

                  updateState={this.props.updateState}
                /> :
                <Redirect to="/book-now/availability" />
                }
              />
              </Col>  :
              <Col sm={8}>
                <Route exact path="/book-now/" render={ () =>
                  <Redirect to="/book-now/availability" /> }
                />
                <Route path="/book-now/availability/" render={ () =>
                  <Available
                    data={this.props.data}
                    user={this.props.user}
                    checkout={this.props.checkout}

                    fetchSearch={this.props.fetchSearch}
                    updateState={this.props.updateState}
                  /> }
                />
                <Route path="/book-now/billing/" render={ () => (roomSelected) ?
                  <Billing
                    data={this.props.data}
                    user={this.props.user}
                    checkout={this.props.checkout}

                    getData={this.props.getData}
                    updateState={this.props.updateState}
                  />:
                  <Redirect to="/book-now/availability" />}
                />
                <Route path="/book-now/payment/" render={ () => (billed) ?
                  <Payment
                    data={this.props.data}
                    user={this.props.user}
                    checkout={this.props.checkout}
                    checkEdit={this.props.checkEdit}

                    getData={this.props.getData}
                    updateState={this.props.updateState}
                  /> :
                    <Redirect to="/book-now/billing" /> }
                />
                <Route path="/book-now/confirmation/" render={ () => (paid) ?
                  <Confirmation
                    data={this.props.data}
                    user={this.props.user}
                    checkout={this.props.checkout}

                    updateState={this.props.updateState}
                  /> :
                  <Redirect to="/book-now/payment" />
                  }
                />
              </Col>
            }

        </Row>

      </div>

    );
  }
}

export default Book;

// <Route path="/book-now/billing/" render={ () => (this.props.checkout.selected && this.props.admin.username) ?
//   <Billing
//
//   /> :
//   <Redirect to="/book-now/availability" />
// }
// />
// <Route path="/book-now/payment/" render={ () => (this.props.checkout.billing) ?
//   <Payment
//
//   /> :
//   <Redirect to="/book-now/billing" /> }
// />
// <Route path="/book-now/confirmation/" render={ () => (this.props.checkout.payment) ?
//   <Confirmation
//
//   /> :
//   <Redirect to="/book-now/payment" /> }
// />
