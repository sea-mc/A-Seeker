import React, {Component} from 'react';
import './css/bodyContent.css'
import './css/bootstrap.css';
import './loginButton'
import Cookies from 'universal-cookie';
import bodyContent from "./bodyContent";
import LoginButton from "./loginButton";

//Checks the clients cookies for an auth token
//if one is found it is checked against the middle ware
class Login extends Component {

    constructor(props) {
        super(props);
        this.state = { email: '' , password: ''};
    }

    SubmitHandler = (event) => {
        event.preventDefault();

        var requestOptions = {
            method: 'POST',
            redirect: 'follow'
        };

        //todo; hash the password before submission

        fetch( "http://localhost:1177/userauth/login?email="+this.state.email +"&password="+this.state.password, requestOptions)
            .then(response => response.text())
            .then(result => {
                const cookies = new Cookies();
                //store the token in the browser cookies
                cookies.set('bearer', result.toString(), { path: '/' });
                console.log(cookies.get('bearer'));
                alert("Login Successful!")
            })
            .catch(error => {
                alert("Invalid login, please try again")
            });

    };


    emailChangeHandler = (event) => {
        this.setState({email: event.target.value})
    };


    passwordChangeHandler = (event) => {
        this.setState({password: event.target.value})
    };



    render() {
        return (
            <form className={bodyContent()} onSubmit={this.SubmitHandler}>
                <h3>Sign In</h3>

                <div className="form-group">
                    <label>Email address</label>
                    <input type="email" className="form-control" placeholder="Enter email" onChange={this.emailChangeHandler} />
                </div>

                <div className="form-group">
                    <label>Password</label>
                    <input type="password" className="form-control" placeholder="Enter password" onChange={this.passwordChangeHandler}/>
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