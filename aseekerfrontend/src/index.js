import React from 'react';
import ReactDOM from 'react-dom';
import './components/css/index.css';
import HomePage from './components/homePage';
import * as serviceWorker from './serviceWorker';
import { Route, Link, BrowserRouter as Router, Switch, NavLink } from 'react-router-dom'
import Navbar from "./components/navbar";
import SideBar from "./components/sideBar";
import Login from "./components/login";

const mux = (
    <Router>
        <div className="App">
            <Navbar/>
            <SideBar/>
        </div>
        <Route path="/login" component={Login} replace/>
    </Router>
);
ReactDOM.render(
    mux,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
