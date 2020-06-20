import React, {Component} from 'react';
import './css/bodyContent.css'
import './css/bootstrap.css';
import  Cookies  from 'universal-cookie';

const cookies = new Cookies();

class Account extends Component {

    constructor(props) {

        super(props);
        this.state = { email: '' , password: ''};
    }

    mySubmitHandler = (event) => {
        event.preventDefault();

        var requestOptions = {
            method: 'POST',
            redirect: 'follow'
        };
        var email = cookies.get('email');
        fetch( "http://localhost:1177/userauth/register/delete?email="+email, requestOptions)
            .then(response => response.text())
            .then(result => {
                console.log(result);
                alert("Your account has been deleted.");
                cookies.remove("email");
            })
            .catch(error => {
                console.log('error', error);
                alert("Internal Server Error, Please refresh page and resubmit form (Sorry!)")
            });

    };


    render() {
        return (
            <div>
                <h3>Hello, {this.state.email}</h3>
                <form onSubmit={this.mySubmitHandler}  className="form-group">
                    <div className="form-row">
                        <button type="submit" className="btn btn-primary btn-block">Delete Account</button>
                    </div>
                </form>
            </div>
        );
    }
}

export default Account;