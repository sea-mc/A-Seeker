#!/usr/bin/env python

# Author: Harrison Affel

# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function

import sys
import time
import json
import os
import shlex
import subprocess
import wave


from deepspeech import wavTranscriber
from deepspeech.DeepSpeech.training.deepspeech_training.util.logging import log_error

os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'
import logging

logging.getLogger('sox').setLevel(logging.ERROR)
import numpy as np

from .DeepSpeech.training.deepspeech_training.util.config import initialize_globals

init = False


def init():
    initialize_globals()


def fail(message, code=1):
    log_error(message)
    sys.exit(code)


global output


def transcribe_file(ds, audio_path):

    # break audio up into chunks to be processed
    print("Chunking file...")
    segments, sample_rate, audio_length, frames = wavTranscriber.vad_segment_generator(audio_path, 3)
    transcribedSegments = []

    inference_time = time.time()
    individualTimes = []
    word = ''
    words = []
    word_times = []
    cur_time = 0.0

    print("Beginning to process generated file chunks")

    for i, segment in enumerate(segments):
        chunkstart = time.time()
        # Run deepspeech on the chunk
        audio = np.frombuffer(segment, dtype=np.int16)
        output = ds.sttWithMetadata(audio, 1)  # Run Deepspeech
        print("done with chunk {}. Took {}".format(i, time.time() - chunkstart))
        transcribedSegments.append(output.transcripts[0])

        for token in output.transcripts[0].tokens:
            if word == '':
                word_times.append(cur_time+token.start_time)

            word += (str(token.text)).strip()

            if token.text == ' ':
                words.append(word)
                word = ''
            individualTimes.append(time.time() - chunkstart)
        cur_time += output.transcripts[0].tokens[len(output.transcripts[0].tokens)-1].start_time

    words.append(word)
    stamped_words = [{"word": w, "time": t} for w, t in zip(words, word_times)]
    for t in word_times:
        print("\n", t)

    # timeSum = 0.0
    # for i in individualTimes:
    #     timeSum += i
    # averageTime = timeSum / len(individualTimes)

    # print("done with file; took{}".format(time.time() - inference_time))
    # print("average chunk time is {}. Current run time is".format(averageTime, time.time() - inference_time))
    # print("Returning transcription to caller.")

    return json.dumps(stamped_words)