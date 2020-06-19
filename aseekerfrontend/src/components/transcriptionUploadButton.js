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
            <Dropzone onDrop={acceptedFiles => console.log(acceptedFiles)}>
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