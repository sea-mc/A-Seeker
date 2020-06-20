import mysql.connector
from deepspeech.database.aseeker_config import *


def connect_to_db():
    transcription_db = mysql.connector.connect(
        host=HOST,
        user=USER,
        password=PASSWORD
    )

    print(transcription_db)
