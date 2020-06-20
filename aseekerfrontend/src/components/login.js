import React, {Component} from 'react';
import './css/bodyContent.css'
import './css/bootstrap.css';
import './loginButton'
import Cookies from 'universal-cookie'
const cookies = new Cookies();

//Checks the clients cookies for an auth token
//if one is found it is checked against the middle ware
class Login extends Component {

    constructor(props) {
        super(props);
        this.state = { email: '' , password: ''};
    }


    emailChangeHandler = (event) => {
        this.setState({email: event.target.value})
    };


    passwordChangeHandler = (event) => {
        this.setState({password: event.target.value})
    };


    handleClick = (event) => {
        event.preventDefault();

        var requestOptions = {
            method: 'POST',
            redirect: 'follow',
        };

        if (this.state.email.toString() === '' || this.state.email === undefined){
            alert("Please enter your email.")
        }

        if (this.state.password.toString() === '' || this.state.password === undefined) {
            alert("Please enter your password")
        }
        alert('http://localhost:1177/userauth/register/login?email='+this.state.email.toString()+"&password="+this.state.password.toString())
        //call auth api and check for user-pass
        fetch('http://localhost:1177/userauth/register/login?email='+this.state.email.toString()+"&password="+this.state.password.toString(), requestOptions)
            .then(response => response.text())
            .catch(error => {
                alert("Account not registered.");
                console.log('error', error);
            })
            .then(result => {
                alert("login Successful");
                cookies.set('email', this.state.email, {path: '/'});
                console.log(result);
            });
    };


    render() {
        return (
            <form onSubmit={this.handleClick}>
                <h3>Sign In</h3>

                <div className="form-group">
                    <label>Email address</label>
                    <input type="email" onChange={this.emailChangeHandler} className="form-control" placeholder="Enter email" />
                </div>

                <div className="form-group">
                    <label>Password</label>
                    <input type="password" onChange={this.passwordChangeHandler} className="form-control" placeholder="Enter password" />
                </div>


                <button type="submit" className="btn btn-primary btn-block">Submit</button>
                <p className="forgot-password text-right">
                    Forgot <a href="#">password?</a>
                </p>
            </form>
        );
    }
}

export default Login;