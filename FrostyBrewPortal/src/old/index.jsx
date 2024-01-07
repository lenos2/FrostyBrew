import React from 'react';
import ReactDOM from 'react-dom/client';
import './assets/styles/App.css';
import App from './App.jsx';
// ...
import reactLogo from './assets/react.svg';


const rootElement = document.getElementById('root');

const root = ReactDOM.createRoot(rootElement);
root.render(
    <div>
        <h1>Hello from React application</h1>
        <img src={reactLogo} className="logo react" alt="React logo" />
        <App />
    </div>
);

