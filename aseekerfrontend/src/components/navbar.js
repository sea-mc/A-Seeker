import React, {Component} from 'react';
import { Route, Link, BrowserRouter as Router, Switch, NavLink } from 'react-router-dom'

class Navbar extends Component {
    render() {
        return (
            <header className="App-header">
                    <div>
                        <Link to="/login">Log In</Link>
                        <Link to = "/register">Sign Up</Link>
                        <Link to = "/logout">Log Out</Link>
                    </div>
            </header>

        );
    }
}

export default Navbar;