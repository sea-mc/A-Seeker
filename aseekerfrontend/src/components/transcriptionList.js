import React, {Component} from 'react';
import TranscriptionUploadButton from "./transcriptionUploadButton";
import css from "./css/transcriptionList.css"
import {ListGroup, ListGroupItem} from "react-bootstrap";
import {withRouter} from 'react-router-dom';
import  Cookies  from 'universal-cookie';
import  transcriptionUpload from "./css/transcriptionUploadCSS.css"
const cookies = new Cookies();


class TranscriptionList extends React.Component {

    constructor(props) {
        super(props);
        this.goToTranscription = this.goToTranscription.bind(this);
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

        //call the middleware to get the requested transcription.
        fetch('http://localhost:1177/transcriptions/get/all?email='+cookies.get("email"),requestOptions )
            .then((response) => response.json())
            .then(transcriptionList => {
                this.setState({ transcriptions: transcriptionList });
            }).catch (err => {
                alert("An error occured: "+err);
                console.log(err)
            });
    }

    goToTranscription(title){
        // load the transcription view for this element
        this.props.history.push({
            pathname: "/transcription/view",
            state: {title : title}
        })
    }

    render() {
        return (
            <div className={css.transcriptionList}>
                <div className="transcriptionUpload">
                    <div>
                        <textarea
                            className="form-control transcriptionUploadTitleInput"
                            id="exampleFormControlTextarea1"
                            rows="1"
                            placeholder={"Enter Transcription Title Here (Do not include any file extensions)"}
                            contentEditable={"true"}
                        />
                    <br/>
                    <TranscriptionUploadButton/>
                </div>
            </div>
               <br/><br/>
                    <ul className="transcriptionList">
                        <ListGroup id="list-group-tabs-example">
                        {this.state.transcriptions.map((transcription) =>
                                <ListGroup.Item action onClick={() => this.goToTranscription(transcription.title)}>
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
    };
}

export default withRouter(TranscriptionList);