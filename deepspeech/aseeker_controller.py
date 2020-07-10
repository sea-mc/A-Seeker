import shlex
import subprocess

from transcribe import transcribe_file



def transcribe_input(filepath, filename):
    if ".wav" not in filename:
        format_file(filename)


    return transcribe_file(filepath, "/transcriptions/" + filename)


def format_file(filename):
    proper_filetypes = [".mp3", ".mp4"]
    if not any(ext in filename for ext in proper_filetypes):
        print("Invalid filetype {}", filename)


def convertMedia(filename):
    ffmpeg_cmd = 'ffmpeg -i {} {}'.format(
        shlex.quote(filename), shlex.quote(filename + "converted.wav"))
    try:
        subprocess.check_output(shlex.split(ffmpeg_cmd), stderr=subprocess.PIPE)
    except subprocess.CalledProcessError as e:
        raise RuntimeError('ffmpeg returned non-zero status: {}'.format(e.stderr))
    except OSError as e:
        raise OSError(e.errno,
                      'ffmpeg not found')
    return shlex.quote(filename + "converted.wav")