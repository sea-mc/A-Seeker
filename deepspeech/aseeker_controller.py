from deepspeech.DeepSpeech.transcribe import *


def transcribe_input(filepath, filename):
    if ".wav" not in filename:
        format_file(filename)
    transcribe_one(filepath, "/transcriptions/" + filename)

    # email = user.get_email()

    preview =



def format_file(filename):
    proper_filetypes = [".mp3", ".mp4"]
    if not any(ext in filename for ext in proper_filetypes):
        print("Invalid filetype {}", filename)
