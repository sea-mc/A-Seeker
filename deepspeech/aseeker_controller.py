from transcribe import transcribe_file



def transcribe_input(filepath, filename):
    if ".wav" not in filename:
        format_file(filename)


    return transcribe_file(filepath, "/transcriptions/" + filename)




def format_file(filename):
    proper_filetypes = [".mp3", ".mp4"]
    if not any(ext in filename for ext in proper_filetypes):
        print("Invalid filetype {}", filename)

