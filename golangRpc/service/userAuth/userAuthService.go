package userAuth

import (
	"../../domain"
	"database/sql"
	"fmt"
	_ "github.com/go-sql-driver/mysql"
	"github.com/prometheus/common/log"
	"time"
)

const (
	host     = "ASeeker-transcription-database"
	port     = 3306
	user     = "root"
	password = "toor"
	dbname   = "aseeker"
)

var Database *sql.DB

func InitDatabaseConn() {
	log.Info("Starting Userauth Database Conn...")
	log.Info("Sleeping for 10 seconds...")
	time.Sleep(10 * time.Second)
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

func LoginUser(email, pass string) bool {
	sqlq := "select * from account where email = '" + email + "' and password = '" + pass + "';"
	r, e := Database.Query(sqlq)
	if e != nil {
		log.Fatal(e)
	}

	for r.Next() {
		usr := domain.Account{}
		r.Scan(&usr.Email, &usr.Password)
		return true
	}
	return false
}

func RegisterUser(email, password string) error {
	sqlq := "insert into account (email, password) values ('" + email + "', '" + password + "');"
	_, e := Database.Query(sqlq)
	if e != nil {
		log.Error(e)
		return e
	}

	return nil
}

func CheckForUser(email string) bool {
	sqlq := "select * from account where email = '" + email + "';"
	r, e := Database.Query(sqlq)
	if e != nil {
		log.Fatal(e)
	}

	for r.Next() {
		usr := domain.Account{}
		r.Scan(&usr.Email, &usr.Password)
		return true
	}

	return false
}

func DeleteUser(email string) error {
	sqlq := "DELETE FROM account where email = '" + email + "';"
	_, e := Database.Query(sqlq)
	if e != nil {
		log.Error(e)
		return e
	}

	return nil
}

func DeleteTranscriptions(email string) error {

	sqlq := "DELETE FROM transcription where email = '" + email + "';"
	_, e := Database.Query(sqlq)
	if e != nil {
	log.Error(e)
	return e
}

	return nil
}