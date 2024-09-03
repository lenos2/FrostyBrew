
import React from "react";
import ReactDOM from "react-dom/client";

import 'bootstrap/dist/css/bootstrap.min.css';
import $ from 'jquery';
import { createPopper } from '@popperjs/core';
import 'bootstrap/dist/js/bootstrap.bundle.min';

//import 'dotenv/config';
import Routing from "@/Routing";
import '@/assets/styles/App.css';

const domContainer = document.getElementById("root");
const root = ReactDOM.createRoot(domContainer);
root.render(
  <React.StrictMode>
    <Routing />
  </React.StrictMode>
);
