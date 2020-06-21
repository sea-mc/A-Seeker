package transcriptions

import (
	"../../domain"
	"database/sql"
	"fmt"
	"github.com/pkg/errors"
	"github.com/prometheus/common/log"
)

var Database *sql.DB

const (
	host     = "ASeeker-transcription-database"
	port     = 3306
	user     = "root"
	password = "toor"
	dbname   = "aseeker"
)

func InitTranscriptionDBConn() {
	log.Info("Attempting connection...")

	var psqlInfo = fmt.Sprintf("%s:%s@tcp(%s:%d)/%s", user, password, host, port, dbname)
	tmpdb, err := sql.Open("mysql", psqlInfo)
	if err != nil {
		log.Error(err)
	}
	Database = tmpdb //Because we use := we cannot directly assign Database as := places things on the stack

	err = Database.Ping()
	if err != nil {
		log.Error(err)
		log.Errorf("Transcription Database connection unsuccessful: %s  %s  %s", user, host, dbname)

	} else {
		log.Infof("Transcription Database connection successful: %s  %s  %s", user, host, dbname)
	}
}
func GetAll() {
	sqlq := "select * from transcription;"
	r, e := Database.Query(sqlq)
	if e != nil {
		log.Error(e)
		return
	}

	var transcriptions []domain.Transcription
	for r.Next() {
		log.Info("Got a transcription")
		trns := domain.Transcription{}
		r.Scan(&trns.Email, &trns.Preview, &trns.FullTranscription, &trns.ContentFilePath, &trns.Title)
		transcriptions = append(transcriptions, trns)
		log.Info(trns)
	}

}
func GetTranscriptions(email string) ([]domain.Transcription, error) {
	sqlq := "select * from transcription where email = '" + email + "';"
	r, e := Database.Query(sqlq)
	if e != nil {
		return []domain.Transcription{}, errors.New("Could not Perform database query")
	}

	var transcriptions []domain.Transcription
	for r.Next() {
		log.Info("Got a transcription")
		trns := domain.Transcription{}
		r.Scan(&trns.Email, &trns.Preview, &trns.FullTranscription, &trns.ContentFilePath, &trns.Title)
		transcriptions = append(transcriptions, trns)
	}
	if len(transcriptions) == 0 {
		return []domain.Transcription{}, errors.New("Could not find any transcriptions for email " + email)
	}
	return transcriptions, nil
}

func GetTranscriptionByTitle(title string) (domain.Transcription, error) {
	sqlq := "select * from transcription where title = '" + title + "';"
	r, e := Database.Query(sqlq)
	if e != nil {
		log.Fatal(e)
	}

	for r.Next() {
		trns := domain.Transcription{}
		r.Scan(&trns.Email, &trns.Preview, &trns.FullTranscription, &trns.ContentFilePath, &trns.Title)
		return trns, nil
	}

	return domain.Transcription{}, errors.New("Could not find transcription by title: " + title)
}

func InsertTranscription(transcription domain.Transcription) error {
	sqlq := "insert into transcription (email, preview, full_transcription, content_url, title)" +
		" values ('" + transcription.Email + "', '" + transcription.Preview + "' " + transcription.FullTranscription + " '," + "'" + transcription.ContentFilePath + "','" + transcription.Title + "');"
	_, e := Database.Query(sqlq)
	if e != nil {
		log.Error(e)
		return e
	}

	return nil
}

func DeleteTranscription(transcriptionTitle string) error {
	sqlq := "delete from transcription where title = '" + transcriptionTitle + "';"
	_, e := Database.Query(sqlq)
	if e != nil {
		log.Error(e)
		return e
	}

	return nil
}
