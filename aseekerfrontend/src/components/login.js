import React, {Component} from 'react';
import './css/bodyContent.css'
import './css/bootstrap.css';
import './loginButton'
import bodyContent from "./bodyContent";
import LoginButton from "./loginButton";

//Checks the clients cookies for an auth token
//if one is found it is checked against the middle ware
class Login extends Component {

    render() {
        return (
            <form className={bodyContent()}>
                <h3>Sign In</h3>

                <div className="form-group">
                    <label>Email address</label>
                    <input type="email" className="form-control" placeholder="Enter email" />
                </div>

                <div className="form-group">
                    <label>Password</label>
                    <input type="password" className="form-control" placeholder="Enter password" />
                </div>
                

                <LoginButton/>
                <p className="forgot-password text-right">
                    Forgot <a href="#">password?</a>
                </p>
            </form>
        );
    }
}

export default Login;