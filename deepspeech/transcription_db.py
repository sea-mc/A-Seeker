import pymysql


class Database:
    def __init__(self):
        host = 'localhost'
        user = 'root'
        password = 'toor'
        db = 'aseeker'

        self.con = pymysql.connect(host=host, user=user, password=password, db=db,
                                   cursorclass=pymysql.cursors.DictCursor)
        self.cur = self.con.cursor()

    def insert_transcription(self, email, preview, full_transcription, audio_path, title):
        self.cur.execute('INSERT INTO transcription (email,Preview...,{},{},example);', full_transcription, audio_path)

    def get_transcriptions(self):
        self.cur.execute('SELECT * FROM transcription;')
        result = self.cur.fetchall()
        print(result)
        return result
