import React, {Component} from 'react';
import './css/bodyContent.css'
import './css/bootstrap.css';
import bodyContent from "./bodyContent";

class Register extends Component {
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

                <div className="form-group">
                    <label>Password</label>
                    <input type="password" className="form-control" placeholder="Confirm password" />
                </div>


                <button type="submit" className="btn btn-primary btn-block">Register</button>
            </form>
        );
    }
}

export default Register;