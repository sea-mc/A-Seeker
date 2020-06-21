import React, {Component} from 'react';
import TranscriptionUploadButton from "./transcriptionUploadButton";
import css from "./css/transcriptionList.css"

import  Cookies  from 'universal-cookie';

const cookies = new Cookies();

class TranscriptionList extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            transcriptions: []
        }
    }

    componentWillMount() {
        //get the user email from the cookies
        var requestOptions = {
            method: 'GET',
            redirect: 'follow',
        };

        //call the middleware to get the users transcriptions.
        fetch('http://localhost:1177/transcriptions/get/all?email='+cookies.get("email"),requestOptions )
            .then((response) => response.json())
            .then(transcriptionList => {
                this.setState({ transcriptions: transcriptionList });
            }).catch (err => {
                alert(err);
                console.log(err)
            });
    }


    render() {
        return (
            <div className={css.transcriptionList}>
               <TranscriptionUploadButton/>
               <br/><br/>
                <ul className="transcriptionList">
                    {this.state.transcriptions.map(transcription => <div>{transcription.title} {transcription.email} {transcription.preview}</div>)}
                </ul>
            </div>
        );
    }
}

export default TranscriptionList;