import React, {Component} from 'react';
import './css/bootstrap.css'
import './loginButton'
import './css/bodyContent.css'
import bodyContent from "./bodyContent";
import Cookies from 'universal-cookie'
import css from './css/transcriptionView.css'
const cookies = new Cookies();



//Checks the clients cookies for an auth token
//if one is found it is checked against the middle ware
class TranscriptionView extends Component {

    constructor(props) {
        super(props);

        this.state = {
            title: this.props.location.state.title
        }

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

        //call auth api and check for user-pass
        fetch('http://localhost:1177/userauth/register/login?email='+this.state.email.toString()+"&password="+this.state.password.toString(), requestOptions)
            .then(response => {
                if (response.status === 401) {
                    alert("Login Unsuccessful - Account not registered");
                }else{
                    alert("Login Successful");
                    cookies.set('email', this.state.email, {path: '/'});
                }
            });
        
        
    };


    render() {
        return (
            <div className="transcriptionView">
                <div>
                    {<h4>{this.state.title}</h4>}
                </div>
            </div>

        );
    }
}

export default TranscriptionView;