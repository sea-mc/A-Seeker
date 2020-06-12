package userAuth

import (
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
	log.Info("Starting Database Conn...")
	log.Info("Sleeping for 10 seconds...")
	time.Sleep(10 * time.Second)
	log.Info("Attempting connection...")

	var psqlInfo = fmt.Sprintf("%s:%s@tcp(%s:%d)/%s", user, password, host, port, dbname)
	tmpdb, err := sql.Open("mysql", psqlInfo)
	if err != nil {
		log.Fatal(err)
	}
	Database = tmpdb //Because we use := we cannot directly assign Database as := places things on the stack

	err = Database.Ping()
	if err != nil {
		log.Fatal(err)
	}
	log.Infof("Transcription Database connection successful: %s  %s  %s", user, host, dbname)
}

func CheckIfUserIsRegistered(email string) bool {
	sqlq := "select * from account where email = '" + email + "';"
	r, e := Database.Query(sqlq)
	if e != nil {
		log.Fatal(e)
	}

	for r.Next() {
		log.Info(r.Columns())
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

func DeleteUser(email string) error {
	sqlq := "DELETE FROM account where email = '" + email + "';"
	_, e := Database.Query(sqlq)
	if e != nil {
		log.Error(e)
		return e
	}

	return nil
}
