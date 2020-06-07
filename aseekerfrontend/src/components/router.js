import React, {Component} from 'react';
import {BrowserRouter as Router, Route} from "react-router-dom";
import Index from "./index"
import NavBar from "./navbar";

class CustomRouter extends Component {
    render() {
        return <Router>
            <div>
                <Route path="/" component={Index} />
                <Route path="/users" component={NavBar} />
            </div>
        </Router>
    }
}

export default CustomRouter;