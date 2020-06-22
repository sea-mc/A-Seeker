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
        title = title + '.wav'

        self.cur.execute('INSERT INTO transcription (test@test.com,Preview...,A full transcription...,/audio/title,example);')
        # POST method to insert transcription into DB

    def get_transcriptions(self):
        self.cur.execute('SELECT * FROM transcriptions;')

        result = self.cur.fetchall()

        return result
