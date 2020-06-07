import React from 'react';
import logo from '../logo.svg';
import './css/App.css';
import './css/homePage.css'
import Navbar from "./navbar";
import SideBar from "./sideBar";
import homePageMatter from "./homePageMatter";
import {BrowserRouter as Router, Route} from "react-router-dom";
function Index() {
  return (
    <div>
        <div className="App">
          <Navbar/>
          <SideBar/>

        </div>
        <div className="homePage">
            <h1> What is A-Seeker?</h1>
            <p>A-Seeker is a tool that uses speech recognition to transcribe audio files. Once an
                audio file has been transcribed, you can search through the transcription and be taken to that point in the media.
                Don't forget to make an account so that you can save your transcriptions for later! </p>

            <div className="quickStart">
                <h3>I'm going to save my work: </h3>
                <a href="/signup">Sign Up</a>
                <h3>I'm just trying this out: </h3>
                <a href="/transcriptions">Transcriptions Page</a>
            </div>

            <h1>Let's Get Started: </h1>
            <p>To get started with A-Seeker, you can traverse to the <a href="/transcriptions">transcriptions</a> page to get started with your first upload!</p>
        </div>
    </div>
  );
}

export default Index;
