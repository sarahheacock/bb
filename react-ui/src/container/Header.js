import React from 'react';
import PropTypes from 'prop-types';

import { NavLink } from 'react-router-dom'
import { Nav, Navbar, NavItem, Image } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import icon from './icon.svg';

//navigation bar
// <Image
//   style={{width: 60, height: 60}}
//   src={icon}
// />
// <LinkContainer to="/book-now">
//   <NavItem><div className="book">Book Now!</div></NavItem>
// </LinkContainer>
const Header = (props) => {


    return (
      <div>
        <Navbar inverse className="navigation">
          <Navbar.Header>
            <Navbar.Brand >

            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>

          <Navbar.Collapse>
            <Nav className="ml-auto" navbar>

              <LinkContainer to="/home" >
                <NavItem>Home</NavItem>
              </LinkContainer>
              <LinkContainer to="/about" >
                <NavItem>About</NavItem>
              </LinkContainer>
              <LinkContainer to="/rooms" >
                <NavItem>Rooms</NavItem>
              </LinkContainer>
              <LinkContainer to="/local-guide" >
                <NavItem>Local Guide</NavItem>
              </LinkContainer>
              <LinkContainer to="/book-now" >
                <NavItem><div className="book">Book Now</div></NavItem>
              </LinkContainer>

            </Nav>
            <Nav pullRight>
              <LinkContainer to="/login">
                <NavItem>{(props.admin.username) ? <div className="book">{`Welcome, ${props.admin.username}`}</div> : <div className="book">Login</div>}</NavItem>
              </LinkContainer>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </div>
    );
}

export default Header;

Header.propTypes = {
  admin: PropTypes.object.isRequired
}
