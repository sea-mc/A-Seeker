import React, {Component} from 'react';
import TranscriptionUploadButton from "./transcriptionUploadButton";
import css from "./css/transcriptionList.css"
import {ListGroup, ListGroupItem} from "react-bootstrap";
import  Cookies  from 'universal-cookie';
import BodyContent from "./css/bodyContent.css"
import {MDBInput} from "mdbreact";
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
                alert("Please Login To view your saved transcriptions.");
                console.log(err)
            });
    }

    goToTranscription = (event) => {

    };

    render() {
        return (
            <div className={css.transcriptionList}>
            <div >
                <TranscriptionUploadButton/>
                <div className="transcriptionUploadTitleInput">
                    <textarea
                        className="form-control"
                        id="exampleFormControlTextarea1"
                        rows="5"
                        placeholder={"Enter Transcription Title Here (Do not include any file extensions)"}
                        contentEditable={"true"}
                    />
                <br/>
                </div>
            </div>
               <br/><br/>
                    <ul className="transcriptionList">
                        <ListGroup id="list-group-tabs-example">
                        {this.state.transcriptions.map((transcription) =>
                                <ListGroup.Item action onClick={this.goToTranscription}>
                                    <div>
                                        <h4>{transcription.title}</h4>
                                        <h6>{transcription.preview}</h6>
                                        <br/>
                                        <h6>{transcription.contentFilePath}</h6>
                                    </div>
                                </ListGroup.Item>
                            )}
                        </ListGroup>
                    </ul>
            </div>
        );
    }
}

export default TranscriptionList;