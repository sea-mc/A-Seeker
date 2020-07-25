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
            words: Array.from(this.extract_words(this.props.location.state.tokens)).join(" "),
            tokens: this.props.location.state.tokens
        }

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

    enableViewing(title, tokens) {

        //get an array of words from the text box, not including white spaces
        let wordz = this.state.words + " ";
        var wordsarray = Array.from(Array.from(wordz).join("").split(/(\s+)/)).filter(function (str) {
            return /\S/.test(str)
        });
        var endarray = [];
        for(var i =0; i < wordsarray.length; i++){
            //check if current word is valid JSON object
            try{
                console.log(JSON.parse(wordsarray[i]));
                endarray[i] = JSON.parse(wordsarray[i])
            }catch {
                if(i >= tokens.length) {
                    endarray[i] = {
                        word: wordsarray[i],
                        time: tokens[tokens.length-1].time,
                    }
                }else {
                    endarray[i] = {
                        word: wordsarray[i],
                        time: tokens[i].time,
                    }
                }
            }
        }
        console.log(endarray);
        //upload tokens to the backend
        var requestOptions = {
            method: 'POST',
            redirect: 'follow',
            body: endarray
        };

        fetch('http://localhost:1177/transcriptions/update?email='+this.state.email + "&title="+title, requestOptions)
            .then(response => {
                alert(response.status)
            });

        this.props.history.push({
            pathname: "/transcription/view",
            state: {
                title: title
            }
        })
    }

    textChanged(event) {
        this.setState({
            words: event.target.value
        });
    }
    getwords(){

        return Array.from(this.state.words)
    }

    render(){

        return (
            <div className="transcriptionView">
                <h4> {this.state.title} </h4>
                <Button variant="primary" size="sm" onClick={(e) =>
                    this.enableViewing(this.state.title, this.state.tokens)}
                >Save</Button>{' '}
                <video
                    id="video"
                    controls
                    title="My own video player"
                />
                <hr/>
                <textarea
                    value={this.state.words}
                    spellCheck={false}
                    onChange={(e) => this.textChanged(e)}
                    rows={25}
                />
            </div>
        );
    }
}

export default TranscriptionEdit;
