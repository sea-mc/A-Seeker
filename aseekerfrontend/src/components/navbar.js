import React, {Component} from 'react';
import { Route, Link, BrowserRouter as Router, Switch, NavLink } from 'react-router-dom'
import Cookies from 'universal-cookie'
const cookies = new Cookies();

class Navbar extends Component {
    onClick= (event) => {
      //remove email cookie
        cookies.remove("email");
    };

    render() {
        return (
            <header className="App-header">
                    <div>
                        <Link to="/login">Log In</Link>
                        <Link to = "/register">Sign Up</Link>
                        <a  href="/" onClick={this.onClick}>Log Out</a>
                    </div>
            </header>

        );
    }
}

export default Navbar;