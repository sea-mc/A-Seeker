import fnmatch
import glob
import os
import shlex
import subprocess
import sys
import time
import wave

from DeepSpeech.native_client.python import Model
from transcribe import transcribe_file

AUDIO_FOLDER = './audio'
TRIM_FOLDER = './trim'

def convertToWav(filename):

    print("Converting " + filename + " to WAV ", file=sys.stderr)
    ffmpeg_cmd = 'ffmpeg -y -i {} -acodec pcm_s16le -ar 16000 {}'.format(shlex.quote(filename), shlex.quote(filename + "converted.wav"))
    try:
        subprocess.check_output(shlex.split(ffmpeg_cmd), stderr=subprocess.PIPE)
    except subprocess.CalledProcessError as e:
        raise RuntimeError('ffmpeg returned non-zero status: {}'.format(e.stderr))
    except OSError as e:
        raise OSError(e.errno,
                      'ffmpeg not found')

    print("Conversion for " + filename + " done! ")
    return shlex.quote(filename + "converted.wav")


def trimMedia(filename, startTime, endTime):

    #resolve the media file using the filename
    f = []
    for (dirpath, dirnames, filenames) in os.walk("/audio"):
        if 'trimmed_*' not in filenames:
            f.extend(filenames)


    longest_string = max(f, key=len)

    ffmpeg_cmd = 'ffmpeg -y -i {} -ss {} -to {} -c copy {}'.format(
        shlex.quote(os.path.join(AUDIO_FOLDER, longest_string)),
        shlex.quote(startTime),
        shlex.quote(endTime),
        shlex.quote(os.path.join(TRIM_FOLDER, "trimmed_"+startTime+"_"+endTime+"_"+longest_string))
    )

    try:
        subprocess.check_output(shlex.split(ffmpeg_cmd), stderr=subprocess.PIPE)
    except subprocess.CalledProcessError as e:
        raise RuntimeError('ffmpeg returned non-zero status: {}'.format(e.stderr))
    except OSError as e:
        raise OSError(e.errno,
                      'ffmpeg not found')


    # add padding to the end of the audio file
    trimmedFileName = os.path.join(TRIM_FOLDER, "trimmed_"+startTime+"_"+endTime+"_"+longest_string)

    sox_cmd = 'sox {} {} pad 0 1'.format(
        shlex.quote(trimmedFileName),
        shlex.quote(trimmedFileName)
    )

    try:
        subprocess.check_output(shlex.split(sox_cmd), stderr=subprocess.PIPE)
    except subprocess.CalledProcessError as e:
        raise RuntimeError('sox returned non-zero status: {}'.format(e.stderr))
    except OSError as e:
        raise OSError(e.errno,
                      'sox not found')



    trimmedFileName = os.path.join(TRIM_FOLDER, "trimmed_"+startTime+"_"+endTime+"_"+longest_string)


    print("Trimming & padding for " + filename + " done! ", file=sys.stderr)
    return trimmedFileName





# Our model likes mono audio
def squash_channels(audio_path):
    ffmpeg_cmd = 'ffmpeg -y -i {} -ac 1 {}'.format(shlex.quote(audio_path), shlex.quote(audio_path + "mono.wav"))
    try:
        subprocess.check_output(shlex.split(ffmpeg_cmd), stderr=subprocess.PIPE)
    except subprocess.CalledProcessError as e:
        raise RuntimeError('ffmpeg returned non-zero status: {}'.format(e.stderr))
    except OSError as e:
        raise OSError(e.errno, 'ffmpeg not found'.format(e.strerror))
    return shlex.quote(audio_path + "mono.wav")





def convert_samplerate(audio_path, desired_sample_rate):
    ffmpeg_cmd = 'ffmpeg -y -i {} -ar {} {}'.format(
        shlex.quote(audio_path), desired_sample_rate, shlex.quote(audio_path + "16k.wav"))
    try:
        subprocess.check_output(shlex.split(ffmpeg_cmd), stderr=subprocess.PIPE)
    except subprocess.CalledProcessError as e:
        raise RuntimeError('ffmpeg returned non-zero status: {}'.format(e.stderr))
    except OSError as e:
        raise OSError(e.errno,
                      'ffmpeg not found, use {}hz files or install it: {}'.format(desired_sample_rate, e.strerror))
    return shlex.quote(audio_path + "16k.wav")





#media_processor will analyze the given media and modify it as required
#it returns the path to the modified audio file, and the deepspeech pbmm model
def media_processor(audio_path):

    print('This is the path {}'.format(audio_path), file=sys.stderr)
    audio_file = wave.open(audio_path, 'rb')
    file_rate = audio_file.getframerate()
    channels = audio_file.getnchannels()

    loadtime = time.time()
    ds = Model(os.getcwd() + "/deepspeech-0.7.4-models.pbmm")
    print('Model Loaded into memory. Took {} seconds'.format(time.time() - loadtime), file=sys.stderr)

    if file_rate != ds.sampleRate():
        print(
            'Warning: original sample rate ({}) is different than {}hz. Resampling might produce erratic speech recognition.'.format(
                file_rate, ds.sampleRate()), file=sys.stderr)
        audio_path = convert_samplerate(audio_path, ds.sampleRate())

    if channels > 1:
        audio_path = squash_channels(audio_path)

    print('This is the new {}'.format(audio_path), file=sys.stderr)
    return audio_path, ds






def transcribe_input(audio_path):
    file_path = convertToWav(audio_path)
    filepath, ds = media_processor(file_path)
    return transcribe_file(filepath, ds)
