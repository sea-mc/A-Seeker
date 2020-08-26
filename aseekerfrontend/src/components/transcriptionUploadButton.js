import React, {Component} from 'react';
import Dropzone from 'react-dropzone'
import Cookies from "universal-cookie";

const cookies = new Cookies();
class TranscriptionUploadButton extends React.Component {


    render() {
        return (
            <div>
            <Dropzone
                onDrop={ acceptedFiles => {

                    //get the title that the user input
                    var uploadBox = document.getElementById("exampleFormControlTextarea1");

                    var email = cookies.get("email");
                    if (email === ""){
                        alert("Please login to upload a transcription");
                        return
                    }

                    //do upload post
                    const formData = new FormData();
                    formData.append('file', acceptedFiles[0]); //only one file at a time
                    alert("http://aseeker_middleware:1177/deepSpeech/media/upload?email='"+cookies.get("email")+"'&filename='"+uploadBox.value+"'");
                    fetch("http://aseeker_middleware:1177/deepSpeech/media/upload?email='"+cookies.get("email")+"'&filename='"+uploadBox.value+"'", {
                        method: 'POST',
                        body: formData
                    })
                        .then(response => response.text())
                        .then(data => {
                            console.log(data);
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