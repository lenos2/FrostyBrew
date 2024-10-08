import React from 'react';
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <nav class="navbar navbar-dark sticky-top bg-dark flex-md-nowrap p-0">

      <Link to="/" className="navbar-brand col-sm-3 col-md-2 mr-0">
        <span data-feather="home"></span>
        Frosty Brew
      </Link>
      <input class="form-control form-control-dark w-100" type="text" placeholder="Search" aria-label="Search" />
      <ul class="navbar-nav px-3">
        <li class="nav-item text-nowrap">
          <a class="nav-link" href="#">Sign out</a>
        </li>
      </ul>
    </nav>
  );
};
export default Header;