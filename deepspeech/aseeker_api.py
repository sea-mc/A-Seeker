from deepspeech.database.transcription_db import connect_to_db
import os
from flask import Flask, flash, request, redirect, url_for
from werkzeug.utils import secure_filename

AUDIO_FOLDER = '~/audio'

if not os.path.exists(AUDIO_FOLDER):
    os.makedirs(AUDIO_FOLDER)

ALLOWED_EXTENSIONS = {'wav', 'mp3', 'mp4'}

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = AUDIO_FOLDER

if __name__ == '__main__':
    connect_to_db()
    app.run(port='1178')


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route('/', methods=['GET', 'POST'])
def upload_file():
    if request.method == 'POST':
        if 'file' not in request.files:
            flash('No file part')
            return redirect(request.url)
        file = request.files['file']

        if file.filename == '':
            flash('No selected file')
            return redirect(request.url)
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            return redirect(url_for('uploaded_file',
                                    filename=filename))
    return 200




