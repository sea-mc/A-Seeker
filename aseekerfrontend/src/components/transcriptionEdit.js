import React, {Component} from 'react';
import './css/bootstrap.css'
import './css/bodyContent.css'
import Cookies from 'universal-cookie'
import {Button, ButtonGroup, ToggleButton} from "react-bootstrap";
import TranscriptionView from "./transcriptionView";

const cookies = new Cookies();



class TranscriptionEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: this.props.location.state.title,
            words: this.extract_words(this.props.location.state.tokens),
            tokens: this.props.location.state.tokens
        }
        console.log({
            title: this.props.location.state.title,
            tokens: this.props.location.state.tokens
        })
    }


    componentDidMount() {

        var requestOptions = {
            method: 'GET',
            redirect: 'follow',
        };

        var video = document.getElementById("video");

        fetch('http://localhost:1177/deepSpeech/media/get?filename='+this.state.title, requestOptions)
            .then(response => response.blob())
            .then( blob => {
                video.src = window.URL.createObjectURL(blob);
            });
    }


    handleEdit = e => {
        this.setState({
            filter_tokens: this.state.tokens
        });
    };

    extract_words(tokens) {
        const words = []
        for(var i=0; i<tokens.length; i++){
            words.push(tokens[i].word)
        }
        return words
    }

    searchList=(event)=>{
        let keyword = event.target.value;
        this.setState({search:keyword})
    }

    gotoTime(time){
        var video = document.getElementById("video");
        //manipulate the media player to the time
        video.currentTime = time;
    }

    enableViewing(title) {
        this.props.history.push({
            pathname: "/transcription/view",
            state: {
                title: title
            }
        })
    }

    render(){

        return (
            <div className="transcriptionView">
                <h4> {this.state.title} </h4>
                <Button variant="primary" size="sm" onClick={() =>
                    this.enableViewing(this.state.title, this.state.tokens)}
                >Save</Button>{' '}
                <video
                    id="video"
                    controls
                    title="My own video player"
                />
                <hr/>
                <textarea
                    value={this.state.words.join("")}
                    rows={25}
                />
            </div>
        );
    }
}

export default TranscriptionEdit;
