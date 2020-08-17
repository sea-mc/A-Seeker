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
	host = "ASeeker-transcription-database"
	//host     = "localhost"
	port     = 3306
	user     = "root"
	password = "toor"
	dbname   = "aseeker"
)

var Database *sql.DB

//InitDataBaseConn opens a SQL connection to the A-Seeker transcription database. This function
//MUST be called before server startup. Running this function will result in a STW for 10 seconds.
//This is intentional, and allows the MySQL container to initialize.
func InitDatabaseConn() {
	log.Info("Starting UserAuth Database Conn...Sleeping for 20 seconds...")
	time.Sleep(20 * time.Second)
	log.Info("Attempting connection...")

	var psqlInfo = fmt.Sprintf("%s:%s@tcp(%s:%d)/%s", user, password, host, port, dbname)
	tmpdb, err := sql.Open("mysql", psqlInfo)
	if err != nil {
		log.Error(err)
	}
	Database = tmpdb //Because we use := we cannot directly assign Database as := places things on the stack

	err = Database.Ping() //sql.Open only opens a new location in memory for the db conn, does not open the conn. Use ping to open conn.
	if err != nil {
		log.Error(err)
		log.Errorf("Transcription Database connection unsuccessful: %s  %s  %s", user, host, dbname)

	} else {
		log.Infof("Transcription Database connection successful: %s  %s  %s", user, host, dbname)
	}
}

//LoginUser is a service function for determining if a user exists in the database using a simple select statement.
//This function is called by the userAuthController to determine the validity of the credentials passed within the UI.
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

//RegisterUser performs a SQL insert statement into the account table.
func RegisterUser(email, password string) error {
	sqlq := "insert into account (email, password) values ('" + email + "', '" + password + "');"
	_, e := Database.Query(sqlq)
	if e != nil {
		log.Error(e)
		return e
	}

	return nil
}

//CheckForUser performs a SQL select statement on the account table, filtering results on the given 'email' parameter.
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

//DeleteUser performs a SQL delete operation on the account table
func DeleteUser(email string) error {
	sqlq := "DELETE FROM account where email = '" + email + "';"
	_, e := Database.Query(sqlq)
	if e != nil {
		log.Error(e)
		return e
	}

	return nil
}

//DeleteTranscriptions performs a DELETE operation on the transcription table for all entries associated with the given email.
func DeleteTranscriptions(email string) error {

	sqlq := "DELETE FROM transcription where email = '" + email + "';"
	_, e := Database.Query(sqlq)
	if e != nil {
		log.Error(e)
		return e
	}

	return nil
}
