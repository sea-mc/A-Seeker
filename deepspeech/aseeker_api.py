import sys
sys.path.append('~/A-Seeker')
from database.transcription_db import *
import os
from flask import Flask, flash, request, redirect, url_for, jsonify
from werkzeug.utils import secure_filename

AUDIO_FOLDER = '~/audio'
if not os.path.exists(AUDIO_FOLDER):
    os.makedirs(AUDIO_FOLDER)

ALLOWED_EXTENSIONS = {'wav', 'mp3', 'mp4'}

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = AUDIO_FOLDER


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route('/upload/<filename>', methods=['POST'])
def upload_file(filename):
    """Upload a file."""

    if "/" in filename:
        # Return 400 BAD REQUEST
        os.abort(400, "no subdirectories directories allowed")

    with open(os.path.join(AUDIO_FOLDER, filename), "wb") as fp:
        fp.write(request.data)

    # Return 201 CREATED
    return "", 201


@app.route('/user/get-transcriptions', methods=['GET'])
def get_transcriptions():
    database.get_transcriptions_db()


if __name__ == '__main__':
    app.run(host='0.0.0.0', port='1178')


# # check if the post request has the file part
#     if '.wav' not in request.files:
#         resp = jsonify({'message': 'No wav file part in the request'})
#         resp.status_code = 400
#         return resp
#     file = request.files['file']
#     if file.filename == '':
#         resp = jsonify({'message': 'No file selected for uploading'})
#         resp.status_code = 400
#         return resp
#     if file and allowed_file(file.filename):
#         filename = secure_filename(file.filename)
#         file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
#         resp = jsonify({'message': 'File successfully uploaded'})
#         resp.status_code = 201
#         return resp
#     else:
#         resp = jsonify({'message': 'Allowed file types are txt, pdf, png, jpg, jpeg, gif'})
#         resp.status_code = 400
#         return resp