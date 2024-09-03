import React from 'react';
import { Link } from "react-router-dom";
import { LinkContainer } from 'react-router-bootstrap'
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';


const SideBar = () => {

    return (
        <nav class="col-md-2 d-none d-md-block bg-light sidebar">


            <div class="sidebar-sticky">
                <ul class="nav flex-column">
                    <li class="nav-item">
                        <Link to="/" className='nav-link active'>
                            <span data-feather="home"></span>
                            Dashboard <span class="sr-only">(current)</span>
                        </Link>
                    </li>
                    <li class="nav-item">
                        <Link to="products" className='nav-link'>
                            <span data-feather="shopping-cart"></span>
                            Products</Link>
                    </li>
                    <li class="nav-item">
                        <Link to="Recipes" className='nav-link'>
                            <span data-feather="shopping-cart"></span>
                            Recipes</Link>

                    </li>
                    <li class="nav-item">
                        <Link to="orders" className='nav-link'>
                            <span data-feather="shopping-cart"></span>
                            Orders</Link>

                    </li>
                </ul>
            </div>
        </nav>
    );
}

export default SideBar;