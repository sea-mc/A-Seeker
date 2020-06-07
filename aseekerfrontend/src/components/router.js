import React, {Component} from 'react';
import {BrowserRouter as Router, Route} from "react-router-dom";
import bodyContent from "./bodyContent"
import NavBar from "./navbar";

class CustomRouter extends Component {
    render() {
        return <Router>
            <div>
                <Route path="/" component={bodyContent} />
                <Route path="/users" component={NavBar} />
            </div>
        </Router>
    }
}

export default CustomRouter;