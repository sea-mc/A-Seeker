import React, {Component} from 'react';
import "./css/homePage.css"

class homePageMatter extends Component {
    render() {
        return (
            <div>
                <h1> What is A-Seeker?</h1>
                <p>A-Seeker is a tool that uses speech recognition to transcribe audio files. Once an
                audio file has been transcribed, you can search through the transcription and be taken to that point in the media.
                Don't forget to make an account so that you can save your transcriptions for later! </p>

                <div>
                    <h3>I'm going to save my work: </h3>
                    <a>Sign Up</a>
                    <h3>I'm just trying this out: </h3>
                    <a>Transcriptions Page</a>
                </div>

                <h1>Let's Get Started: </h1>
                <p>To get started with A-Seeker, you can traverse to the <a>transcriptions</a> page to get started with your first upload!</p>
            </div>
        );
    }
}

export default homePageMatter;