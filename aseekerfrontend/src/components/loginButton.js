import React, {Component} from 'react';
import "./css/bodyContent.css"

class LoginButton extends React.Component {
    handleClick(){
        //call auth api and check for user-pass
    }
    render() {
        return (
            <button onClick={() => this.handleClick()} type="submit" className="btn btn-primary btn-block">Submit</button>
        );
    }
}

export default LoginButton;