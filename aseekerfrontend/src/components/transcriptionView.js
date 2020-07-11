import React, {Component} from 'react';
import './css/bootstrap.css'
import './loginButton'
import './css/bodyContent.css'

import bodyContent from "./bodyContent";
import Cookies from 'universal-cookie'
import css from './css/transcriptionView.css'
import TranscriptionTextWindow from "./transcriptionTextWindow";
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


    componentDidMount() {
        var requestOptions = {
            method: 'GET',
            redirect: 'follow',
        };

        //call auth api and check for user-pass
        fetch('http://localhost:1177/transcriptions/get/single?email=' + cookies.get("email") + "&title="+this.state.title, requestOptions)
            .then((response) => response.json())
            .then(response => {
                this.setState({transcription: response.fulTranscription});
            }).catch(err => {
            alert("An error occured: " + err);
            console.log(err)

        });

    }

    render(){
        return (
            <div className="transcriptionView">
                <div>
                    {<h4> Transcription Title: {this.state.title}</h4>}
                    {<TranscriptionTextWindow transcription={this.state.transcription}/>}
                </div>

                <video id="player" playsinline controls data-poster="/path/to/poster.jpg">
                    <source src="/path/to/video.mp4" type="video/mp4"/>
                    <source src="/path/to/video.webm" type="video/webm"/>
                    {/*<track kind="captions" label="English captions" src="/path/to/captions.vtt" srcLang="en" default/>*/}
                </video>

            </div>

        )
    }
}

export default TranscriptionView;