import json
import os
import sys
import tensorflow as tf
import transcribe
import aseeker_controller
import transcription_db
from flask import Flask, request
from DeepSpeech.deepspeech_training.util.config import Config, initialize_globals

from DeepSpeech.deepspeech_training.util.config import initialize_globals
from DeepSpeech.deepspeech_training.util.flags import create_flags, FLAGS

AUDIO_FOLDER = './audio'
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

    if "/" in filename:
        # Return 400 BAD REQUEST
        os.abort(400, "no subdirectories directories allowed")

    # if ".jpg" in filename and ".png" in filename | ".pdf" in filename:
    #     return "", 500

    with open(os.path.join(AUDIO_FOLDER, filename), "wb") as fp:
        fp.write(request.data)

    # if ".wav" not in filename | ".mp3" not in filename | ".mp4" not in filename:
    #     #convert media
    #     filename = aseeker_controller.convertMedia(filename)

    transcription = aseeker_controller.transcribe_input(os.path.join(AUDIO_FOLDER, filename), filename)
    # db = transcription_db.Database()
    # db.insert_transcription(transcription)
    # Return 201 CREATED
    return transcription, 201


@app.route('/get-transcriptions', methods=['GET'])
def get_transcriptions():
    db = transcription_db.Database()
    results = db.get_transcriptions()

    return json.dumps(results)


if __name__ == '__main__':
    create_flags()


    tf.app.flags.DEFINE_string('src', '', 'Source path to an audio file or directory or catalog file.'
                                          'Catalog files should be formatted from DSAlign. A directory will'
                                          'be recursively searched for audio. If --dst not set, transcription logs (.tlog) will be '
                                          'written in-place using the source filenames with '
                                          'suffix ".tlog" instead of ".wav".')
    tf.app.flags.DEFINE_string('dst', '', 'path for writing the transcription log or logs (.tlog). '
                                          'If --src is a directory, this one also has to be a directory '
                                          'and the required sub-dir tree of --src will get replicated.')
    tf.app.flags.DEFINE_boolean('recursive', False, 'scan dir of audio recursively')
    tf.app.flags.DEFINE_boolean('force', False, 'Forces re-transcribing and overwriting of already existing '
                                                'transcription logs (.tlog)')
    tf.app.flags.DEFINE_integer('vad_aggressiveness', 2, 'How aggressive (0=lowest, 3=highest) the VAD should '
                                                         'split audio')
    tf.app.flags.DEFINE_integer('batch_size', 2, 'Default batch size')
    tf.app.flags.DEFINE_float('outlier_duration_ms', 5000,
                              'Duration in ms after which samples are considered outliers')
    tf.app.flags.DEFINE_integer('outlier_batch_size', 1, 'Batch size for duration outliers (defaults to 1)')





    FLAGS(sys.argv)
    initialize_globals()

    app.run(host='0.0.0.0', debug=False, threaded=True)


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