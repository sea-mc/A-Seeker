# A-Seeker

or Audio Seeker: An audio video transcription platform

## Introduction

While digital media has largely dominated the information age its presence in everyday life has significantly increased across the globe due to the COVID-19 pandemic.
Sorting through this information is a unique challenge, and currently there exist very few free solutions to this problem. This repository presents Audio Seeker (A-Seeker),
an open source software architecture capable of transcribing both audio and video files. A-Seeker provides an interactive user interface which allows users to search
and then click on a search result to be taken to that point in the processed media. A-Seeker achieves its Automatic Speech Recognition (ASR) functionality through the
utilization of Mozilla’s open source DeepSpeech implementation.


## Features
A-Seeker offers the following features:
1. File uploading handles wav, mp3, and mp4 files
2. Audio is processed into text transcription that can be viewed on the UI
3. Users can type into a search box on the transcription view page to search the transcription for keywords
4. Clicking on a search result or a word in the transcription will skip the media to that word's timestamp
5. Register an account with A-Seeker so users can save their transcriptions
6. Once registered, users can login as well as logout with their credentials
7. Past transcriptions are saved to a user's account and can be accessed at any time
8. Users can delete their account at any time, wiping all data from the backend

## Getting Started
### Installation and Setup
Pre-Requisites:
- Docker: utilizes OS-level virtualization to deliver software in packages called containers
Tutorial to Setup for [Mac](https://docs.docker.com/docker-for-mac/install/) and [Windows](https://docs.docker.com/docker-for-windows/install/)
- Clone or download A-Seeker repository

### Run

Run the start script provided in the project, this will build and run the project locally using docker.

## Demo video

[A-Seeker Demo Video](https://drive.google.com/file/d/1rkindtNzpnAwZZ06Ox8RtNJhWQqsB8e4/view?usp=sharing)

## Contributors

* Harrison Affel, Developer
* Sean Cox, Developer
