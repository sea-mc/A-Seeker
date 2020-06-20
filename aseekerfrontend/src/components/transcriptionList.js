import React, {Component} from 'react';
import TranscriptionUploadButton from "./transcriptionUploadButton";
import css from "./css/transcriptionList.css"
class TranscriptionList extends React.Component {

    constructor(props) {
        super(props);
        this.setState(this.state)
    }


    componentDidMount() {

        //get the user email from the state
        var requestOptions = {
            method: 'GET',
            redirect: 'follow',
        };

        alert(JSON.stringify(requestOptions.body));
        //call the middleware to get the users transcriptions.
        fetch('http://localhost:1177/transcriptions/get/all',requestOptions )
            .then((response) => response.text())
            .then(transcriptionList => {
                alert(JSON.stringify(transcriptionList));
                this.setState({ Transcriptions: transcriptionList });
                alert("Success");
                alert(this.state.Transcriptions)

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
                    <li>Transcription 1</li>
                    {this.state.Transcriptions.map(((transcription) => (<li key={transcription.title}>(transcription.title)</li>)))}
                </ul>
            </div>
        );
    }
}

export default TranscriptionList;