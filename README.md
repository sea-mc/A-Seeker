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
4. Clicking on a search result, or a word in the transcription will skip the media to that word's timestamp
5. Register an account with A-Seeker so users can save their transcriptions
6. Once registered, users are able to login as well as logout with their credentials
7. Past transcriptions are saved to a user's account and can be accessed at any time
8. Users can delete their account at any time, wiping all data from the backend

## Getting Started
### Installation and Setup
Pre-Requisites:
- Docker: utilizes OS-level virtualization to deliver software in packages called containers
Tutorial to Setup for [Mac](https://docs.docker.com/docker-for-mac/install/) and [Windows](https://docs.docker.com/docker-for-windows/install/)
- Python3.X  
- TensorFlow (Mac 2.3.0 - Linux & Container 1.15.3)
- Clone or download A-Seeker repository
- run the setup script to configure the deepspeech engine 
    - The setup script will install the following        
        - All dependencies of the DeepSpeech project
        - The DeepSpeech language model and scorer required (~1 GB)

### Run

Run the start script provided in the project, this will build and run the project locally using docker.

run the following command to avoid downloading the model every startup 

 
`cd deepspeech && wget -c -i ./modelUrls` 

## Demo video

[A-Seeker Demo Video](https://drive.google.com/file/d/1rkindtNzpnAwZZ06Ox8RtNJhWQqsB8e4/view?usp=sharing)

## Example Files
These are some of the files used in the testing of A-Seeker which contributed to our report.
- [covid.mp4 Coronavirus Newscast](https://drive.google.com/file/d/1HJ7b4E8eo4IoEQjDzlaJa1IM7je8MqIK/view?usp=sharing)
- [eddy1.wav Entertainment Podcast Clip](https://drive.google.com/file/d/1GP13uJBxCM0TyfTUFUEpotRb-0MrGAtL/view?usp=sharing)
- [gettysburg_address.mp3 Reading of Lincoln's Famous Speech](https://drive.google.com/file/d/1-nyrnTGrI8VNg8909ilynFRvrpSTJeJA/view?usp=sharing)
- [example_file.wav Some example speech used in testing STT](https://drive.google.com/file/d/1UtbKNpPN0vx-fE53cdtxoVwrCZfI6iGt/view?usp=sharing)
- [MLK.mp3 Dr. King's 'Something Happening' Speech](https://drive.google.com/file/d/1dhc6tTZ1rorDKxtqPdFbtQf-eLa_ASwF/view?usp=sharing)
- [monica_clinton.wav Newscast of the Clinton Affair](https://drive.google.com/file/d/1iXr9FZJMFXMUZh8Zx5yHsgJ2FVGaMTjY/view?usp=sharing)
- [npr_water_podcast.mp3 NPR Podcast on Water](https://drive.google.com/file/d/1O5zd1-MZ0iijVWPa9K-IS5Fa6a2qMmZN/view?usp=sharing)
- [deniro.wav Clip of Robert DeNiro speaking](https://drive.google.com/file/d/1UW_eBvIIcMipbP9NPjSKGDOcUlfiHp4U/view?usp=sharing)
- [why_harris.wav NPR Politics Podcast on Kamala Harris as VP Nominee](https://drive.google.com/file/d/1uIDwNzIzL9SyM5WgtHval61bC22ANtn9/view?usp=sharing)
- [mit_lecture.mp4 An MIT Calculus Lecture](https://drive.google.com/file/d/1bbLQmT-euuY9_w_dp3f0rGV59rqpVZRo/view?usp=sharing)


## Contributors

* Harrison Affel, Developer
* Sean Cox, Developer
