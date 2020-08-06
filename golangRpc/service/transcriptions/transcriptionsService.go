package transcriptions

import (
	"../../domain"
	"database/sql"
	"encoding/json"
	"fmt"
	"github.com/pkg/errors"
	"github.com/prometheus/common/log"
	"strings"
)

var Database *sql.DB

const (
	host = "ASeeker-transcription-database"
	//host     = "localhost"
	port     = 3306
	user     = "root"
	password = "toor"
	dbname   = "aseeker"
)

//InitDataBaseConn opens a SQL connection to the A-Seeker transcription database. This function
//MUST be called before server startup. Running this function will result in a STW for 10 seconds.
//This is intentional, and allows the MySQL container to initialize.
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

//this is a debug function
func GetAll() {
	sqlq := "select * from transcription;"
	r, e := Database.Query(sqlq)
	if e != nil {
		log.Error(e)
		return
	}

	var transcriptions []domain.Transcription
	for r.Next() {
		trns := domain.Transcription{}
		r.Scan(&trns.Email, &trns.Preview, &trns.FullTranscription, &trns.ContentFilePath, &trns.Title)
		transcriptions = append(transcriptions, trns)
	}

}

//GetTranscriptions will accept an email as a parameter and will return all transcriptions associated with said email, or an error as appropriate.
func GetTranscriptions(email string) ([]domain.Transcription, error) {
	log.Info("Getting Transcription list for " + email)
	sqlq := "select * from transcription where email = '" + email + "';"
	r, e := Database.Query(sqlq)
	if e != nil {
		return []domain.Transcription{}, errors.New("Could not Perform database query")
	}

	var transcriptions []domain.Transcription

	for r.Next() {
		trns := domain.Transcription{}

		err := r.Scan(&trns.Email, &trns.Preview, &trns.RawFullTranscription, &trns.ContentFilePath, &trns.Title)
		if err != nil {
			log.Error(err)
		}
		transcriptions = append(transcriptions, trns)
	}
	if len(transcriptions) == 0 {
		return []domain.Transcription{}, errors.New("Could not find any transcriptions for email " + email)
	}

	//decode the base64 json and marshal it into the correct attribute
	for _, e := range transcriptions {

		var token domain.TranscriptionToken
		err := json.Unmarshal(e.RawFullTranscription, &token)
		if err != nil {
			if !strings.Contains(e.Title, "demo") {
				log.Error(err)
			}
		}

	}

	return transcriptions, nil
}

//GetTranscriptions will accept a title as a parameter and will return all transcriptions associated with said title, or an error as appropriate.
func GetTranscriptionByTitle(title string) (domain.Transcription, error) {
	sqlq := "select * from transcription where title = '" + title + "';"
	r, e := Database.Query(sqlq)
	if e != nil {
		log.Fatal(e)
	}

	for r.Next() {
		trns := domain.Transcription{}
		r.Scan(&trns.Email, &trns.Preview, &trns.RawFullTranscription, &trns.ContentFilePath, &trns.Title)
		var rawTranscript domain.Transcription
		e := json.Unmarshal(trns.RawFullTranscription, &rawTranscript)
		if e != nil {
			return domain.Transcription{}, e
		}
		trns.FullTranscription = rawTranscript.FullTranscription
		return trns, nil
	}

	return domain.Transcription{}, errors.New("Could not find transcription by title: " + title)
}

//InsertTranscription will attempt to insert the given transcription into the database.
func InsertTranscription(transcription domain.Transcription) error {
	jsonTranscription, _ := json.Marshal(transcription)
	jsonString := string(jsonTranscription)
	jsonString = strings.Replace(jsonString, "'", "\\'", -1)
	sqlq := "insert into transcription (email, preview, full_transcription, content_url, title)" +
		" values ('" + strings.ReplaceAll(transcription.Email, "'", "") + "', '" + transcription.Preview + "', '" + jsonString + "'," + "'" + transcription.ContentFilePath + "','" + transcription.Title + "');"
	log.Infoln(sqlq)
	_, e := Database.Query(sqlq)
	if e != nil {
		log.Error(e)
		return e
	}

	return nil
}

//UpdateTranscription will update the information for a given transcription. The primary keys are the email and title.
func UpdateTranscription(transcription domain.Transcription) error {
	jsonTranscription, _ := json.Marshal(transcription)
	jsonString := string(jsonTranscription)
	jsonString = strings.Replace(jsonString, "'", "\\'", -1)
	sqlq := "update transcription SET full_transcription = '" + jsonString + "' WHERE email = '" + transcription.Email + "' AND title = '" + transcription.Title + "';"
	log.Info(sqlq)
	_, e := Database.Query(sqlq)
	if e != nil {
		log.Error(e)
		return e
	}
	return nil
}

//CheckForUser runs a SQL select statement on the account table and will return true if more than one value is returned for the given email.
func CheckForUser(email string) bool {
	sqlq := "select * from account where email = '" + email + "';"
	r, e := Database.Query(sqlq)
	if e != nil {
		log.Error(e)
		return false
	}
	userfound := false
	for r.Next() {
		userfound = true
	}
	return userfound
}

//DeleteTranscription will delete a transcription which matches the given transcriptionTitle.
func DeleteTranscription(transcriptionTitle string) error {
	sqlq := "delete from transcription where title = '" + transcriptionTitle + "';"
	_, e := Database.Query(sqlq)
	if e != nil {
		log.Error(e)
		return e
	}

	return nil
}
