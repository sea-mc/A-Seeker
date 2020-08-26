import React, {Component} from 'react';
import './css/bootstrap.css'
import './loginButton'
import './css/bodyContent.css'
import Cookies from 'universal-cookie'
import './css/transcriptionView.css'
import './css/transcriptionTextWindow.css'
import {Button, ButtonGroup, ToggleButton} from "react-bootstrap";

const cookies = new Cookies();



class TranscriptionView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: this.props.location.state.title,
            tokens: [],
            filter_tokens: [],
            search: null
        };

        this.extract_words = this.extract_words.bind(this);
    }


    componentDidMount() {

        var requestOptions = {
            method: 'GET',
            redirect: 'follow',
        };

        fetch('http://aseeker_middleware:1177/transcriptions/get/single?email=' + cookies.get("email") + "&title="+this.state.title, requestOptions)
            .then((response) => response.json())
            .then(response => {
                this.setState({
                    transcription: this.extract_words(response.fulTranscription).join(' '),
                    times: this.extract_times(response.fulTranscription),
                    tokens: response.fulTranscription
                });
                console.log(response)
            }).catch(err => {
            alert("Please Login To submit media files for transcriptions");
            console.log(err)

        });
        var video = document.getElementById("video");

        fetch('http://aseeker_middleware:1177/deepSpeech/media/get?filename='+this.state.title, requestOptions)
            .then(response => response.blob())
            .then( blob => {
                video.src = window.URL.createObjectURL(blob);
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

    handleChange = e => {
        this.setState({
            filter_tokens: this.state.tokens
        });
    };

    searchList=(event)=>{
        let keyword = event.target.value;
        this.setState({search:keyword})
    }


    enableEditing(t_title, token_list) {
        this.props.history.push({
            pathname: "/transcription/edit",
            state: {
                title: t_title,
                tokens : token_list,
                email: this.state.email,
            }
        })
    }


    getBody(){
        return this.state.tokens.map((transcription) =>
            <p onClick={function(){
                var video = document.getElementById("video");
                //manipulate the media player to the time
                video.currentTime = transcription.time;
            }}>{transcription.word}</p>
        );
    }
    getResults() {

        var found = [];
        let k = 0;
        for (var i = 0; i < this.state.tokens.length; i++) {
            if (this.state.search !== null) {
                if (this.state.search.length > 1) {
                    if (this.state.tokens[i].word.toLowerCase().includes(this.state.search.toLowerCase())) {


                        // //get the words of surrounding tokens to provide a textual context to the search result

                        // //get the 5 words prior and after the found search result
                        var firstFiveWords = "";
                        for(let j = i-5; j < i; j++){
                            if(this.state.tokens[i] !== undefined) {
                                firstFiveWords += this.state.tokens[j].word + " "
                            }
                        }

                        var nextFiveWords = "";
                        if( i < this.state.tokens.length - 1){
                            for(let j = i; j < i+5; j++){
                                // console.log(j)
                                if(this.state.tokens[j] !== undefined) {
                                    // console.log(this.state.tokens[j].word);
                                    nextFiveWords += this.state.tokens[j].word + " ";
                                }
                            }
                        }


                        let fin = firstFiveWords.concat(nextFiveWords);
                        found[k] = {
                          word: fin,
                          time: this.state.tokens[i].time
                        };
                        k++;
                    }
                }
            }
        }


        var elements = [];
        if(found.length === 0){
            return (
            <li>
                <span></span>
                <span></span>
            </li>
            );
        }

        if (found.length > 0) {
            for (i = 0; i < found.length; i++) {
                if(found[i] !== undefined) {
                    console.log(found[i].time);
                    let curtime = found[i].time;
                    elements[i] = (
                        <li onClick={()=>{
                            var video = document.getElementById("video");
                            //manipulate the media player to the time
                            video.currentTime = curtime-0.75; //take 750ms off so that we can actually hear the search result
                        }}>
                            <p>{found[i].word}</p>
                            <p>({found[i].time})</p>
                        </li>);
                }
            }
        }
        return elements;
    }

    render(){

        return (
            <div className="transcriptionView">
                <h4> {this.state.title} </h4>
                <Button variant="primary" size="sm" onClick={() =>
                    this.enableEditing(this.state.title, this.state.tokens)}
                >Edit</Button>
                <div className="mediaAndSearch">
                    <video
                        id="video"
                        controls
                    />
                    <div className="search-bar">
                        <input type="text" placeholder="Search Transcription..." onChange={(e)=>this.searchList(e)}/>
                        <ul>
                            {this.getResults()}
                        </ul>
                    </div>
                </div>
                <hr/>
                <div className="main-transcription">
                    {this.getBody()}
                </div>
            </div>
        );
    }
}

export default TranscriptionView;