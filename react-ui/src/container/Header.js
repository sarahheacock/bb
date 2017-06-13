import React from 'react';
import PropTypes from 'prop-types';

import { Nav, Navbar, NavItem, Image } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import slide from './slider.svg';

//navigation bar
const Header = (props) => {
  // <Image
  //   style={{width: 70, height: 70}}
  //   src={slide}
  // />

    return (
      <div>
        <Navbar inverse className="navigation">
          <Navbar.Header>
            <Navbar.Brand>
              {"PBS"}
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>

          <Navbar.Collapse>
            <Nav className="ml-auto" navbar>

              <LinkContainer exact to="/" >
                <NavItem>Home</NavItem>
              </LinkContainer>
              <LinkContainer to="/authors" >
                <NavItem>Authors</NavItem>
              </LinkContainer>
              <LinkContainer to="/publications" >
                <NavItem>Publications</NavItem>
              </LinkContainer>
              <LinkContainer to="/news" >
                <NavItem>News</NavItem>
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
