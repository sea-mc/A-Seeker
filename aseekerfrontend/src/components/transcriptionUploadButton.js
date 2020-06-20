import React, {Component} from 'react';
import Dropzone from 'react-dropzone'
import TranscriptionUpload from "./css/transcriptionUploadCSS.css"

class TranscriptionUploadButton extends React.Component {

    state = {
        Transcriptions: []
    };


    render() {
        return (
            <div  className="transcriptionUpload">
            <Dropzone
                onDrop={ acceptedFiles => {

                    //do upload post
                    const formData = new FormData();
                    formData.append('myFile', acceptedFiles[0]); //only one file at a time
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
                            <input {...getInputProps()}/>
                            <p>Drag 'n' drop some files here, or click to select files</p>
                        </div>
                    </section>
                )}
            </Dropzone>
            </div>
        );
    }
}

export default TranscriptionUploadButton;