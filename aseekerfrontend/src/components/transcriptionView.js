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
    getSnapshotBeforeUpdate(prevProps, prevState) {
    }

    componentDidMount() {
        var requestOptions = {
            method: 'GET',
            redirect: 'follow',
        };

        //call auth api and check for user-pass
        fetch('http://localhost:1177/transcriptions/get/single?email=' + cookies.get("email") + "&title="+this.state.title, requestOptions)
            .then((response) => response.json())
            .then(response => {
                alert(JSON.stringify(response));
                console.log(response)
            }).catch(err => {
            alert("An error occured: " + err);
            console.log(err)

        });

    }

    render(){
        return (
            <div className="transcriptionView">
                <div>
                    {<h4>{this.state.title}</h4>}
                </div>
            </div>

        )
    }
}

export default TranscriptionView;