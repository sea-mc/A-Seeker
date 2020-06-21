import React, {Component} from 'react';
import Dropzone from 'react-dropzone'
import TranscriptionUpload from "./css/transcriptionUploadCSS.css"
import BodyContent from "./css/bodyContent.css";
import { MDBInput } from 'mdbreact';

class TranscriptionUploadButton extends React.Component {


    render() {
        return (
            <div  className="transcriptionUpload">
            <Dropzone
                onDrop={ acceptedFiles => {

                    //do upload post
                    const formData = new FormData();
                    formData.append('file', acceptedFiles[0]); //only one file at a time
                    console.log(formData);
                    fetch('http://localhost:1177/deepSpeech/media/upload', {
                        method: 'POST',
                        body: formData
                    })
                        .then(response => response.text())
                        .then(data => {
                            console.log(data)
                        })
                        .catch(error => {
                            alert("Error Uploading File, Please Try Again (Sorry!)");
                            console.log(error);
                        })
                    }}>

                {({getRootProps, getInputProps}) => (
                    <section  >
                        <div {...getRootProps()} >
                            <input {...getInputProps()} type="file"/>
                            <p>After entering a transcription title and dragging and drop a file here (or by click to browse) the file will begin processing.</p>
                        </div>
                    </section>
                )}
            </Dropzone>
            </div>
        );
    }
}

export default TranscriptionUploadButton;