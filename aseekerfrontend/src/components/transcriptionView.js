import React, {Component} from 'react';
import './css/bootstrap.css'
import './loginButton'
import './css/bodyContent.css'

import bodyContent from "./bodyContent";
import Cookies from 'universal-cookie'
import './css/transcriptionView.css'
import './css/transcriptionTextWindow.css'
import {Form} from "react-bootstrap";

const cookies = new Cookies();



//Checks the clients cookies for an auth token
//if one is found it is checked against the middle ware
class TranscriptionView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: this.props.location.state.title
        }

        this.handleEdit = this.handleEdit.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.extract_words = this.extract_words.bind(this);

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
                this.setState({
                    transcription: this.extract_words(response.fulTranscription).join(' '),
                    times: this.extract_times(response.fulTranscription)
                });
                console.log(response)
            }).catch(err => {
            alert("An error occured: " + err);
            console.log(err)

        });

    }

    extract_words(api_response) {
        const words = []
        for(var i=0; i<api_response.length; i++){
            words.push(api_response[i].word.valueOf(String))
        }
        return words
    }

    extract_times(api_response) {
        const times = []
        for(var i=0; i<api_response.length; i++){
            times.push(api_response[i].time)
        }
        return times
    }

    handleEdit(event) {
        this.setState({transcription : event.target.value})
    }

    handleSubmit(event) {
        alert('A change was submitted: ' + this.state.transcription);
        event.preventDefault();
    }

    render(){
        return (
            <div className="transcriptionView">
                    {<h4> Transcription Title: {this.state.title}</h4>}
                <video id="player" playsinline controls data-poster="/path/to/poster.jpg">
                    <source src="/path/to/video.mp4" type="video/mp4"/>
                    <source src="/path/to/video.webm" type="video/webm"/>
                    {/*<track kind="captions" label="English captions" src="/path/to/captions.vtt" srcLang="en" default/>*/}
                </video>
                <div className="transcriptionTextWindow">
                    <Form.Control
                        as="textarea"
                        rows="45"
                        width
                        value={this.state.transcription} // todo: once transcription can be passed from backend it loads here
                        onChange={this.handleEdit}
                    />
                </div>

            </div>

        )
    }
}

export default TranscriptionView;