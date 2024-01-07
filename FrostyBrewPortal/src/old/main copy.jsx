import React from "react";
import ReactDOM from "react-dom/client";
import 'bootstrap/dist/css/bootstrap.min.css';

import TodoApp from "@/components/TodoApp";
import Dashboard from "@/pages/Dashboard";

const domContainer = document.getElementById("root");
const root = ReactDOM.createRoot(domContainer);
root.render(
    <React.StrictMode>
        {/* <TodoApp /> */}
        {/* <Dashboard /> */}
    </React.StrictMode>
);
