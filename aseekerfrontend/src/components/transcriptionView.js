import React, {Component} from 'react';
import './css/bootstrap.css'
import './loginButton'
import './css/bodyContent.css'
import Cookies from 'universal-cookie'
import './css/transcriptionView.css'
import './css/transcriptionTextWindow.css'
import ReactSearchBox from 'react-search-box'

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

    handleChange = e => {
        this.setState({
            filter_tokens: this.state.tokens
        });
    };

    searchList=(event)=>{
        let keyword = event.target.value;
        this.setState({search:keyword})
    }

    gotoTime(time){
        var video = document.getElementById("video");
        //manipulate the media player to the time
        video.currentTime = time;
    }

    render(){

        const items = this.state.tokens.filter(data=> {
            if(this.state.search == null)
                return data
            else if(data.word.toLowerCase().includes(this.state.search.toLowerCase())){
                return data
            }
        }).map(data=>{
            return (
                <li onClick={this.gotoTime(data.time)}>
                    <span>{data.word}</span>
                    <span>({data.time})</span>
                </li>
            )
        })

        return (
            <div className="transcriptionView">
                {<h4> {this.state.title} </h4>}
                <video
                    id="video"
                    controls
                    title="My own video player"
                />
                <div className='search-bar'>
                    <input type="text" placeholder="Search Transcription..." onChange={(e)=>this.searchList(e)}/>
                    <ul>
                        {items}
                    </ul>
                </div>
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
        );
    }
}

export default TranscriptionView;