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
const Header = (props) => {


    return (
      <div>
        <Navbar inverse className="navigation">
          <Navbar.Header>
            <Navbar.Brand>
              <NavLink to="/book-now"><div className="book">BOOK NOW</div></NavLink>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>

          <Navbar.Collapse>
            <Nav className="ml-auto" navbar>

              <LinkContainer exact to="/" >
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


            </Nav>
            <Nav pullRight>
              <LinkContainer to="/login">
                <NavItem>{(props.admin) ? "Nancy" : "Login"}</NavItem>
              </LinkContainer>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </div>
    );
}

export default Header;

Header.propTypes = {
  admin: PropTypes.bool.isRequired
}
