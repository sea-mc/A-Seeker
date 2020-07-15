import React, {Component} from 'react';
import './css/bootstrap.css'
import './loginButton'
import './css/bodyContent.css'
import Cookies from 'universal-cookie'
import './css/transcriptionView.css'
import './css/transcriptionTextWindow.css'

const cookies = new Cookies();



class TranscriptionView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: this.props.location.state.title,
            tokens: []
        };

        this.handleEdit = this.handleEdit.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.extract_words = this.extract_words.bind(this);
    }


    componentDidMount() {

        var requestOptions = {
            method: 'GET',
            redirect: 'follow',
        };

        fetch('http://localhost:1177/transcriptions/get/single?email=' + cookies.get("email") + "&title="+this.state.title, requestOptions)
            .then((response) => response.json())
            .then(response => {
                this.setState({
                    transcription: this.extract_words(response.fulTranscription).join(' '),
                    times: this.extract_times(response.fulTranscription),
                    tokens: response.fulTranscription
                });
                console.log(response)
            }).catch(err => {
            alert("An error occured: " + err);
            console.log(err)

        });
        var video = document.getElementById("video");

        fetch('http://localhost:1177/deepSpeech/media/get?filename='+this.state.title, requestOptions)
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

    handleEdit(event) {
        this.setState({transcription : event.target.value})
    }

    handleSubmit(event) {
        alert('A change was submitted: ' + this.state.transcription);
        event.preventDefault();
    }
    
    gotoTime(time){
        var video = document.getElementById("video");
        //manipulate the media player to the time
        alert(time);
        video.currentTime = time;
    }

    render(){
        return (
            <div className="transcriptionView">
                {<h4> Transcription Title: {this.state.title}</h4>}
                    <br/>
                <video
                    id="video"
                    controls
                    title="My own video player"
                />
                <hr/>

                {this.state.tokens.map((transcription) =>
                    <p onClick={function(){
                        var video = document.getElementById("video");
                        //manipulate the media player to the time
                        alert(transcription.time);
                        video.currentTime = transcription.time;
                    }}>{transcription.word}</p>
                )}


            </div>
        )
    }
}

export default TranscriptionView;