import React from 'react';
import ReactDOM from 'react-dom';
import './components/css/index.css';
import bodyContent from './components/bodyContent';
import * as serviceWorker from './serviceWorker';
import { Route, Link, BrowserRouter as Router, Switch, NavLink } from 'react-router-dom'
import Navbar from "./components/navbar";
import SideBar from "./components/sideBar";
import Login from "./components/login";
import Register from "./components/register";
import TranscriptionList from "./components/transcriptionList";
import Account from "./components/account";
import TranscriptionView from "./components/transcriptionView";

const mux = (
    <Router>
        <div className="App">
            <Navbar/>
            <SideBar/>
        </div>
        <Route path={"/"} exact component={bodyContent} replace/>
        <Route path={"/login"} component={Login} replace/>
        <Route path={"/register"} component={Register} replace/>
        <Route path={"/transcriptions"} component={TranscriptionList} replace/>
        <Route path={"/transcription/view"} component={TranscriptionView} replace/>
        <Route path={"/account"} component={Account} replace/>
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
