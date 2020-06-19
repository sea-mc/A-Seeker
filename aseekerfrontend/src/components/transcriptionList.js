import React, {Component} from 'react';
import TranscriptionUploadButton from "./transcriptionUploadButton";
import css from "./css/transcriptionList.css"
class TranscriptionList extends React.Component {

    state = {
        Transcriptions: []
    };

    componentDidMount() {

        //get the user email from the state
        var requestOptions = {
            method: 'POST',
            redirect: 'follow',
            body: JSON.stringify(this.state.email)
        };


        //call the middleware to get the users transcriptions.
        fetch('http://localhost:1177/transcriptions/get/all',requestOptions )
            .then((response) => response.json())
            .then(transcriptionList => {
                this.setState({ Transcriptions: transcriptionList });
                alert(transcriptionList);
            });

    }


    render() {
        return (
            <div className={css.transcriptionList}>
               <TranscriptionUploadButton/>
               <br/><br/>
                <ul className="transcriptionList">
                    <li>Transcription 1</li>
                    {this.state.Transcriptions.map(((transcription) => (<li key={transcription.title}>(transcription.title)</li>)))}
                </ul>
            </div>
        );
    }
}

export default TranscriptionList;