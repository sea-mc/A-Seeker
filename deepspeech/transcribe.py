#!/usr/bin/env python

# Author: Harrison Affel

# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function

import os
import shlex
import subprocess
import sys
import wave

from numpy.ma.bench import timer

from DeepSpeech.native_client.python import Model

os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'
import logging

logging.getLogger('sox').setLevel(logging.ERROR)
import numpy as np

from DeepSpeech.deepspeech_training.util.config import Config, initialize_globals
from DeepSpeech.deepspeech_training.util.flags import FLAGS
from DeepSpeech.deepspeech_training.util.logging import log_error, log_info, log_progress, create_progressbar
from ds_ctcdecoder import Scorer
from multiprocessing import Process, cpu_count
import wavTranscriber

init = False

def init():
    initialize_globals()

def fail(message, code=1):
    log_error(message)
    sys.exit(code)


global output

def transcribe_file(audio_path, tlog_path):
    audio_file = wave.open(audio_path, 'rb')

    ds = Model(os.getcwd() + "/deepspeech-0.7.4-models.pbmm")

    scorer = Scorer(FLAGS.lm_alpha, FLAGS.lm_beta, FLAGS.scorer_path, Config.alphabet)
    print('Model Loaded into memory', file=sys.stderr)


    desired_sample_rate = ds.sampleRate()
    # Point to a path containing the pre-trained models & resolve ~ if used
    dirName = os.path.expanduser("./")
    desired_sample_rate = ds.sampleRate()
    file_rate = audio_file.getframerate()
    channels = audio_file.getnchannels()
    index_path = audio_path

    #Enforce audio structure
    if file_rate != desired_sample_rate:
        print(
            'Warning: original sample rate ({}) is different than {}hz. Resampling might produce erratic speech recognition.'.format(
                file_rate, desired_sample_rate), file=sys.stderr)
        audio_path = convert_samplerate(audio_path, desired_sample_rate)
    else:
        audio_file = np.frombuffer(audio_file.readframes(audio_file.getnframes()), np.int16)

    if channels > 1:
        audio_path = squash_channels(index_path, audio_path)

    audio_file = wave.open(audio_path, 'rb')
    # Resolve all the paths of model files
    output_graph, scorer = wavTranscriber.resolve_models(dirName)

    # Load output_graph, alpahbet and scorer
    model_retval = wavTranscriber.load_model(output_graph, scorer)
    print("starting transcription")

    # Run VAD on the input file
    print("Processing Transcript")
    segments, sample_rate, audio_length = wavTranscriber.vad_segment_generator(audio_path, 3)
    inference_time = 0.0
    transcribedSegments = []
    for i, segment in enumerate(segments):
        # Run deepspeech on the chunk

        print("Processing chunk %002d" % (i,))
        audio = np.frombuffer(segment, dtype=np.int16)

        inference_time = 0.0
        # Run Deepspeech
        logging.debug('Running inference...')
        output = ds.sttWithMetadata(audio, 1)

        logging.debug('Inference done')
        print("Transcript: %s" % output.transcripts[0])
        transcribedSegments.append(output.transcripts[0])

    print("done with transcription; took{}".format(inference_time))
    print(''.join(map(str, transcribedSegments)))
    return ''.join(map(str, transcribedSegments))



#Our model likes single channel audio
def squash_channels(firstPath, audio_path):
    sox_cmd = 'ffmpeg -y -i {} -ac 1 {}'.format(shlex.quote(audio_path), shlex.quote(firstPath+"mono.wav"))
    try:
        output = subprocess.check_output(shlex.split(sox_cmd), stderr=subprocess.PIPE)
        print(sox_cmd)
    except subprocess.CalledProcessError as e:
        raise RuntimeError('SoX returned non-zero status: {}'.format(e.stderr))
    except OSError as e:
        raise OSError(e.errno, 'SoX not found'.format(e.strerror))
    return shlex.quote(firstPath+"mono.wav")


def convert_samplerate(audio_path, desired_sample_rate):
    sox_cmd = 'ffmpeg -y -i {} -ar {} {}'.format(
        shlex.quote(audio_path), desired_sample_rate, shlex.quote(audio_path+"2.wav"))
    try:
        output = subprocess.check_output(shlex.split(sox_cmd), stderr=subprocess.PIPE)
        print(sox_cmd)
    except subprocess.CalledProcessError as e:
        raise RuntimeError('SoX returned non-zero status: {}'.format(e.stderr))
    except OSError as e:
        raise OSError(e.errno,
                      'SoX not found, use {}hz files or install it: {}'.format(desired_sample_rate, e.strerror))
    return shlex.quote(audio_path+"2.wav")









def transcribe_many(src_paths, dst_paths):
    pbar = create_progressbar(prefix='Transcribing files | ', max_value=len(src_paths)).start()
    for i in range(len(src_paths)):
        p = Process(target=transcribe_file, args=(src_paths[i], dst_paths[i]))
        p.start()
        p.join()
        log_progress(
            'Transcribed file {} of {} from "{}" to "{}"'.format(i + 1, len(src_paths), src_paths[i], dst_paths[i]))
        pbar.update(i)
    pbar.finish()
