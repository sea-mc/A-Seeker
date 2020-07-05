#!/usr/bin/env python

# Author: Harrison Affel

# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function

import os
import shlex
import subprocess
import sys
import time
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
    loadtime = time.time()
    ds = Model(os.getcwd() + "/deepspeech-0.7.4-models.pbmm")
    print('Model Loaded into memory. Took {} seconds'.format(time.time()- loadtime), file=sys.stderr)


    # Point to a path containing the pre-trained models & resolve ~ if used
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


    if channels > 1:
        audio_path = squash_channels(index_path, audio_path)


    # break audio up into chunks to be processed
    print("Chunking file...")
    segments, sample_rate, audio_length = wavTranscriber.vad_segment_generator(audio_path, 3)
    transcribedSegments = []


    inference_time = time.time()
    individualTimes = []

    print("Beginning to process generated file chunks")
    for i, segment in enumerate(segments):
        chunkstart = time.time()
        # Run deepspeech on the chunk
        audio = np.frombuffer(segment, dtype=np.int16)
        output = ds.sttWithMetadata(audio, 1) # Run Deepspeech
        print("done with chunk {}. Took {}".format(i, time.time() - chunkstart))
        transcribedSegments.append(output.transcripts[0])
        individualTimes.append(time.time() - chunkstart)

    timeSum = 0.0

    for i in individualTimes:
        timeSum += i
    averageTime = timeSum / len(individualTimes)

    print("done with file; took{}".format(time.time()-inference_time))
    print("average chunk time is {}. Current run time is".format(averageTime, time.time()-inference_time))
    print("Returning transcription to caller.")

    return ''.join(map(str, transcribedSegments))



#Our model likes mono audio
def squash_channels(firstPath, audio_path):
    ffmpeg_cmd = 'ffmpeg -y -i {} -ac 1 {}'.format(shlex.quote(audio_path), shlex.quote(firstPath+"mono.wav"))
    try:
        output = subprocess.check_output(shlex.split(ffmpeg_cmd), stderr=subprocess.PIPE)
        print(ffmpeg_cmd)
    except subprocess.CalledProcessError as e:
        raise RuntimeError('ffmpeg returned non-zero status: {}'.format(e.stderr))
    except OSError as e:
        raise OSError(e.errno, 'ffmpeg not found'.format(e.strerror))
    return shlex.quote(firstPath+"mono.wav")


def convert_samplerate(audio_path, desired_sample_rate):
    ffmpeg_cmd = 'ffmpeg -y -i {} -ar {} {}'.format(
        shlex.quote(audio_path), desired_sample_rate, shlex.quote(audio_path+"16k.wav"))
    try:
        output = subprocess.check_output(shlex.split(ffmpeg_cmd), stderr=subprocess.PIPE)
    except subprocess.CalledProcessError as e:
        raise RuntimeError('ffmpeg returned non-zero status: {}'.format(e.stderr))
    except OSError as e:
        raise OSError(e.errno,
                      'ffmpeg not found, use {}hz files or install it: {}'.format(desired_sample_rate, e.strerror))
    return shlex.quote(audio_path+"16k.wav")


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
