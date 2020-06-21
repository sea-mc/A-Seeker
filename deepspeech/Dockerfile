FROM python:3-alpine3.10

MAINTAINER Sean Cox <coxs4@wit.edu>

RUN apk update && apk add python3
RUN apk update && apk add py3-setuptools
RUN apk update && apk add py-pip

RUN pip3 install Werkzeug
RUN pip install mysql-connector-python
RUN pip install Flask
RUN ls -la

COPY . ./app

RUN ls -la

ENTRYPOINT ["python3","app/aseeker_api.py"]
