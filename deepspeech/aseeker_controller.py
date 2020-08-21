import os
import shlex
import subprocess
import multiprocessing as mp

from transcribe import transcribe_file

AUDIO_FOLDER = './audio'


def transcribe_input(filepath, filename):
    pool = mp.Pool(mp.cpu_count())
    print("Transcribing input using "+str(mp.cpu_count())+" threads.")
    results = [pool.apply(transcribe_file(convertMedia(filepath), "/transcriptions"+filename))]
    pool.close()
    return results


def format_file(filename):
    proper_filetypes = [".mp3", ".mp4"]
    if not any(ext in filename for ext in proper_filetypes):
        print("Invalid filetype {}", filename)


def convertMedia(filename):

    print("Converting " + filename + " to WAV (This could take some time...)")

    ffmpeg_cmd = 'ffmpeg -y -i {} -vn {}'.format(shlex.quote(filename), shlex.quote(filename + "converted.wav"))

    try:
        subprocess.check_output(shlex.split(ffmpeg_cmd), stderr=subprocess.PIPE)
    except subprocess.CalledProcessError as e:
        raise RuntimeError('ffmpeg returned non-zero status: {}'.format(e.stderr))
    except OSError as e:
        raise OSError(e.errno,
                      'ffmpeg not found')

    print("Conversion for " + filename + " done! ")
    print(shlex.quote(os.path.join(AUDIO_FOLDER, filename + "converted.wav")))
    return shlex.quote(filename + "converted.wav")