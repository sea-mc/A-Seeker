import React, {Component} from 'react';
import './css/bootstrap.css'
import './loginButton'
import './css/bodyContent.css'
import bodyContent from "./bodyContent";
import Cookies from 'universal-cookie'
import css from './css/transcriptionView.css'
const cookies = new Cookies();



//Checks the clients cookies for an auth token
//if one is found it is checked against the middle ware
class TranscriptionView extends Component {

    constructor(props) {
        super(props);

        this.state = {
            title: this.props.location.state.title,
            content: {
                email: "",
                title: this.props.location.state.title,
                preview: "",
                fullTranscription: "",
                contentFilePath: "",
            }
        }


    }

    componentDidMount() {
        //call the transcription api and get the content of the selected transcription
        var requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };

        fetch( "http://localhost:1177/transcriptions/get/single?title="+this.state.title, requestOptions)
            .then(response => response.text())
            .then(result => {
                console.log(result);
                this.setState({content: result})

            })
            .catch(error => {
                console.log('error', error);
                alert("Internal Server Error, Please refresh page (Sorry!)")
            });
    }


    render() {
        return (
            <div className="transcriptionView">
                <div>
                    {<h4>{this.state.title}</h4>}
                </div>
            </div>

        );
    }
}

export default TranscriptionView;