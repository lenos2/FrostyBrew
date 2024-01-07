import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Container from 'react-bootstrap/Container';
import { Link } from "react-router-dom";
import { LinkContainer } from 'react-router-bootstrap'

import { useState } from "react";

const Navbar2 = () => {
    console.log(useState(false));
    return (
        <Navbar expand="lg" className="bg-body-tertiary">
            <Container>
                <Navbar.Brand href="#home">Frosty Brew</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <LinkContainer to="/">
                            <Nav.Link>Home</Nav.Link>
                        </LinkContainer>
                        <NavDropdown title="Products" id="products-nav-dropdown">
                            <LinkContainer to="/products">
                                <NavDropdown.Item>View Products</NavDropdown.Item>
                            </LinkContainer>
                            <LinkContainer to="/products/create">
                                <NavDropdown.Item>Create</NavDropdown.Item>
                            </LinkContainer>
                        </NavDropdown>
                        <NavDropdown title="Recipes" id="recipes-nav-dropdown">
                            <LinkContainer to="/recipes">
                                <NavDropdown.Item>View Recipes</NavDropdown.Item>
                            </LinkContainer>
                            <LinkContainer to="/recipes/create">
                                <NavDropdown.Item>Create</NavDropdown.Item>
                            </LinkContainer>
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};
export default Navbar2;