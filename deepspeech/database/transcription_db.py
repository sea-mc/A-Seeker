from configparser import ConfigParser
from database.aseeker_config import *
import mysql
from mysql.connector import Error, MySQLConnection


def connect_to_db():
    conn = None
    try:
        conn = mysql.connector.connect(host=HOST,
                                       database=DB_NAME,
                                       user=USER,
                                       password=PASSWORD)
        if conn.is_connected():
            print('Connected to Transcriptions database')

    except Error as e:
        print(e)

    finally:
        if conn is not None and conn.is_connected():
            conn.close()
            print('Connection to database closed.')


def read_db_config(filename='config.ini', section='mysql'):
    parser = ConfigParser()
    parser.read(filename)

    db = {}
    if parser.has_section(section):
        items = parser.items(section)
        for item in items:
            db[item[0]] = item[1]
    else:
        raise Exception('{0} not found in the {1} file'.format(section, filename))

    return db


def insert_transcription(email, preview, full_transcription, audio_path, title):
    if email == '':
        print("Empty email provided, return error later.")
        email = 'example@gmail.com'

    query = "INSERT INTO aseeker.transcription(email,preview,full_transcription,audio_path,title) " \
            "VALUES(%s,%s,%s,%s,%s)"
    args = (email, preview, full_transcription, audio_path, title)

    try:
        conn = MySQLConnection(**read_db_config())
        cursor = conn.cursor()
        cursor.execute(query, args)

        if cursor.lastrowid:
            print('Last insert was: ', cursor.lastrowid)
        else:
            print('Last insert was not found.')

        conn.commit()

    except Error as e:
        print(e)

    finally:
        cursor.close()
        conn.close()
