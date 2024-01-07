
import React from "react";
import ReactDOM from "react-dom/client";
import 'bootstrap/dist/css/bootstrap.min.css';
//import 'dotenv/config';
import Dashboard from "@/pages/Dashboard";

const domContainer = document.getElementById("root");
const root = ReactDOM.createRoot(domContainer);
root.render(
  <React.StrictMode>
    <Dashboard />
  </React.StrictMode>
);
