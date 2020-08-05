import React from 'react';
import './css/App.css';
import './css/bodyContent.css'
function bodyContent() {
  return (
    <div>
        {/*Page specific content*/}
        <div className="bodyContent">
            <h1> What is A-Seeker?</h1>
            <p>A-Seeker is a tool that uses speech recognition to transcribe audio files. Once an
                audio file has been transcribed, you can search through the transcription and be taken to that point in the media.
                Don't forget to make an account so that you can save your transcriptions for later! </p>

            <div className="quickStart">
                <h3>I'm interested!</h3>
                <a href="/signup">Sign Up</a> Or <a href="/login"> Log in</a>
            </div>

            <h1>Let's Get Started: </h1>
            <p>To get started with A-Seeker, you can traverse to the <a href="/transcriptions">transcriptions</a> page after registering an account to get started with your first upload!</p>
        </div>
    </div>
  );
}

export default bodyContent;
