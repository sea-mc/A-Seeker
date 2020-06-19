FROM python:3-alpine3.10

MAINTAINER Sean Cox <coxs4@wit.edu>

#Set variables
ARG GITHUB_TOKEN

# Install git + SSL ca certificates.
# Git is required for fetching the dependencies.
# Ca-certificates is required to call HTTPS endpoints.
RUN apk update && apk add --no-cache git ca-certificates && update-ca-certificates
RUN apk update && apk add py3-setuptools

RUN git config --global url."https://${GITHUB_TOKEN}@github.com/".insteadOf "https://github.com/"

WORKDIR /deepspeech

# Download repository
RUN git clone https://github.com/coxs4/A-Seeker.git /A-Seeker
COPY . /

RUN echo $WORKDIR
RUN cd $WORKDIR/A-Seeker
RUN git submodule update --init --recursive

ENTRYPOINT ["python3","/deepspeech/aseeker_api.py"]
