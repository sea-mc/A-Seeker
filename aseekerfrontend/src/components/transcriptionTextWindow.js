import React, {Component} from 'react';
import css from "./css/transcriptionTextWindow.css"
import  Cookies  from 'universal-cookie';
import {FormGroup, FormControl, Form, InputGroup} from "react-bootstrap";
const cookies = new Cookies();


class TranscriptionTextWindow extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            transcription: this.props.location.state.transcription
        }

        this.handleEdit = this.handleEdit.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

        console.log(this.props)
    }

    handleEdit(event) {
        this.setState({transcription : event.target.value})
    }

    handleSubmit(event) {
        alert('A change was submitted: ' + this.state.transcription);
        event.preventDefault();
    }

    render() {
        return (
            <div className="transcriptionTextWindow">
                <Form.Control
                    as="textarea"
                    rows="45"
                    value={this.state.transcription} // todo: once transcription can be passed from backend it loads here
                    onChange={this.handleEdit}
                />
            </div>
        )}
}

export default TranscriptionTextWindow;
