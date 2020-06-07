import React, {Component} from 'react';
import {BrowserRouter as Router, Route} from "react-router-dom";
import HomePage from "./homePage"
import NavBar from "./navbar";

class CustomRouter extends Component {
    render() {
        return <Router>
            <div>
                <Route path="/" component={HomePage} />
                <Route path="/users" component={NavBar} />
            </div>
        </Router>
    }
}

export default CustomRouter;