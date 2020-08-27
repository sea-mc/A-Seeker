#!/usr/bin/env python

# Author: Harrison Affel!

# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function

import sys
import threading
import time
import json
import os
import shlex
import subprocess
import wave
from asyncio.queues import Queue

from DeepSpeech.native_client.python import Model

os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'
import logging

logging.getLogger('sox').setLevel(logging.ERROR)
import numpy as np

from DeepSpeech.training.deepspeech_training.util.config import initialize_globals

import wavTranscriber
import queue

init = False


def init():
    initialize_globals()


def fail(message, code=1):
    from DeepSpeech.training.deepspeech_training.util.logging import log_error
    log_error(message)
    sys.exit(code)


global output

# most cpu's are quad cores nowadays, but powers of 2 are always nice
NUM_THREADS = 2


class ChunkWorker(threading.Thread):
    def __init__(self, ReadQueue, WriteQueue, ds):
        threading.Thread.__init__(self)
        self.ds = ds
        self.ReadQueue = ReadQueue
        self.WriteQueue = WriteQueue

    def run(self):
        while True:
            words = []
            word_times = []

            segment = self.ReadQueue.get()
            if segment == -1:
                print("sentinel", file=sys.stderr, flush=True)
                return

            word = ''
            cur_time = 0.0
            chunkstart = time.time()
            audio = np.frombuffer(segment.bytes, dtype=np.int16)

            print("Thread is begining to start processing a chunk", file=sys.stderr, flush=True)
            output = self.ds.sttWithMetadata(audio, 1)  # Run Deepspeech
            print("Thread has FINISHED processing a chunk. It took {} ".format(time.time() - chunkstart),
                  file=sys.stderr, flush=True)

            for token in output.transcripts[0].tokens:
                if word == '':
                    word_times.append(cur_time + token.start_time)
                word += (str(token.text)).strip()
                if token.text == ' ':
                    words.append(word)
                    word = ''

            print(words, file=sys.stderr)
            print(word_times, file=sys.stderr)
            words.append(word)
            stamped_words = [{"word": w, "time": t} for w, t in zip(words, word_times)]
            self.WriteQueue.put(stamped_words)  # send the chunk result back to the master


def transcribe_file(audio_path, tlog_path):
    print(audio_path)
    audio_file = wave.open(audio_path, 'rb')
    loadtime = time.time()
    ds = Model(os.getcwd() + "/deepspeech-0.7.4-models.pbmm")
    print('Model Loaded into memory. Took {} seconds'.format(time.time() - loadtime), file=sys.stderr, flush=True)
    # Point to a path containing the pre-trained models & resolve ~ if used
    desired_sample_rate = ds.sampleRate()
    file_rate = audio_file.getframerate()
    channels = audio_file.getnchannels()
    index_path = audio_path
    # Enforce audio structure
    if file_rate != desired_sample_rate:
        print(
            'Warning: original sample rate ({}) is different than {}hz. Resampling might produce erratic speech recognition.'.format(
                file_rate, desired_sample_rate), file=sys.stderr, flush=True)
        audio_path = convert_samplerate(audio_path, desired_sample_rate)
    if channels > 1:
        audio_path = squash_channels(index_path, audio_path)

    # break audio up into chunks to be processed
    print("Chunking file...", file=sys.stderr, flush=True)
    segments = wavTranscriber.vad_segment_generator(audio_path, 3)
    print("Beginning to process generated file chunks")
    inference_time = time.time()
    # make a set of queues for upstream and downstream communication
    WriteQueue = queue.Queue()
    ReadQueue = queue.Queue()
    workers = []
    # gotta get some workers goin
    for i in range(NUM_THREADS):
        x = ChunkWorker(WriteQueue, ReadQueue, ds)
        x.start()
        workers.append(
            x)  # the queue is used for audio chunks, the other two can be appended to in a thread safe manner

    print("Workers started...", file=sys.stderr, flush=True)

    for i, segment in enumerate(segments):
        print("Writing segment num {}".format(i), file=sys.stderr, flush=True)
        WriteQueue.put(segment)

    print("All Chunks sent...", file=sys.stderr, flush=True)

    for i in range(NUM_THREADS):
        print("stopping worker {}".format(i), file=sys.stderr, flush=True)
        WriteQueue.put(-1)  # send a sentinel to all threads

    for i in range(NUM_THREADS):
        workers[i].join()  # wait for all threads
        print(" worker {} has joined".format(i), file=sys.stderr, flush=True)

    stamped_words = []

    #apply an offset to every n+1 elements

    for ele in list(ReadQueue.queue):
        print(ele, file=sys.stderr, flush=True)
        stamped_words.extend(ele)

    curtime = 0.0
    i = 0
    for e in stamped_words:
        if i == 0:
            curtime = e["time"]
        
        if curtime > e["time"]:
            curtime = curtime + e["time"]
            e["time"] = curtime
        else:
            curtime = e["time"]
        
        i = i + 1


    print("{}".format(json.dumps(stamped_words)), file=sys.stderr, flush=True)
    # timeSum = 0.0
    # for i in individualTimes:
    #     timeSum += i
    # averageTime = timeSum / len(individualTimes)

    print("done with file; took{}".format(time.time() - inference_time))
    # print("average chunk time is {}. Current run time is".format(averageTime, time.time() - inference_time))
    # print("Returning transcription to caller.")
    return json.dumps(stamped_words)


# Our model likes mono audio
def squash_channels(firstPath, audio_path):
    ffmpeg_cmd = 'ffmpeg -y -i {} -ac 1 {}'.format(shlex.quote(audio_path), shlex.quote(firstPath + "mono.wav"))
    try:
        output = subprocess.check_output(shlex.split(ffmpeg_cmd), stderr=subprocess.PIPE)
        print(ffmpeg_cmd)
    except subprocess.CalledProcessError as e:
        raise RuntimeError('ffmpeg returned non-zero status: {}'.format(e.stderr, flush=True))
    except OSError as e:
        raise OSError(e.errno, 'ffmpeg not found'.format(e.strerror))
    return shlex.quote(firstPath + "mono.wav")


def convert_samplerate(audio_path, desired_sample_rate):
    ffmpeg_cmd = 'ffmpeg -y -i {} -ar {} {}'.format(
        shlex.quote(audio_path), desired_sample_rate, shlex.quote(audio_path + "16k.wav"))
    try:
        output = subprocess.check_output(shlex.split(ffmpeg_cmd), stderr=subprocess.PIPE)
    except subprocess.CalledProcessError as e:
        raise RuntimeError('ffmpeg returned non-zero status: {}'.format(e.stderr, flush=True))
    except OSError as e:
        raise OSError(e.errno,
                      'ffmpeg not found, use {}hz files or install it: {}'.format(desired_sample_rate, e.strerror))
    return shlex.quote(audio_path + "16k.wav")

