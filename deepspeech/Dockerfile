FROM python:3.7.7-buster

RUN apt update

RUN pip3 install Werkzeug
RUN pip3 install PyMySQL
RUN pip3 install flask
RUN pip3 install Flask
RUN pip3 install flask_restful
RUN pip3 install virtualenv
RUN pip3 install tensorflow==1.15.3
RUN pip3 install deepspeech
RUN pip3 install semver
RUN pip3 install attrdict
RUN pip3 install ds_ctcdecoder==0.7.3
RUN pip3 install pyxdg
RUN pip3 install webrtcvad
RUN pip3 install progressbar
RUN pip3 install fin
RUN pip3 install sox
RUN pip3 install log_progress
RUN pip install sox
RUN apt-get install sox --yes
RUN apt-get install ffmpeg --yes
COPY . ./
# RUN mkdir training
# RUN python3 DeepSpeech/setup.py build
# RUN python3 DeepSpeech/setup.py install
RUN wget -c -i ./modelUrls
RUN mkdir -p audio
ENTRYPOINT ["python","aseeker_api.py"]
