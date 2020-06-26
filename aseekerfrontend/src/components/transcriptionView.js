import React, {Component} from 'react';
import './css/transcriptionView.css'
import './css/bootstrap.css'
import './loginButton'
import EditableText from  './editableText'
import Cookies from 'universal-cookie'
const cookies = new Cookies();



//Checks the clients cookies for an auth token
//if one is found it is checked against the middle ware
class TranscriptionView extends Component {

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

        //call auth api and check for user-pass
        fetch('http://localhost:1177/userauth/register/login?email='+this.state.email.toString()+"&password="+this.state.password.toString(), requestOptions)
            .then(response => {
                if (response.status === 401) {
                    alert("Login Unsuccessful - Account not registered");
                }else{
                    alert("Login Successful");
                    cookies.set('email', this.state.email, {path: '/'});

                    //call the middleware to get the transcription that was clicked.
                    this.fetch('http://localhost:1177/transcriptions/get/single?'+cookies.get("email"),requestOptions )
                        .then((response) => response.json())
                        .then(transcriptionList => {
                            this.setState({ transcriptions: transcriptionList });
                        }).catch (err => {
                            alert("Please Login To view your saved transcriptions.");
                            console.log(err)
                        });
                }
            });
        
        
    };


    render() {
        return (
            <input
            type="text"
            value={this.state.value}
            onChange={this.handleChange}
            />
        );
    }
}

export default TranscriptionView;