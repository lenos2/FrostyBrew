import React from 'react';
import { Link, useLocation } from "react-router-dom";
import { LinkContainer } from 'react-router-bootstrap'
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';


const SideBar = () => {

    const location = useLocation().pathname;
    console.log("Location", location);

    return (
        <nav class="col-md-2 d-none d-md-block bg-light sidebar">


            <div class="sidebar-sticky">
                <ul class="nav flex-column">
                    <li class="nav-item">
                        <Link to="/" className={'nav-link ' + (location == "/" ? "active" : "")}>
                            <span data-feather="home"></span>
                            Dashboard <span class="sr-only">(current)</span>
                        </Link>
                    </li>
                    <li class="nav-item">
                        <Link to="products" className={'nav-link ' + (location.includes("products") ? "active" : "")}>
                            <span data-feather="shopping-cart"></span>
                            Products</Link>
                    </li>
                    <li class="nav-item">
                        <Link to="recipes" className={'nav-link ' + (location.includes("recipes") ? "active" : "")}>
                            <span data-feather="shopping-cart"></span>
                            Recipes</Link>

                    </li>
                    <li class="nav-item">
                        <Link to="orders" className={'nav-link ' + (location.includes("orders") ? "active" : "")}>
                            <span data-feather="shopping-cart"></span>
                            Orders</Link>

                    </li>
                </ul>
            </div>
        </nav>
    );
}

export default SideBar;