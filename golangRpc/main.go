package main

import (
	userAuth "./controller/UserAuthentication"
	"database/sql"
	"fmt"
	_ "github.com/go-sql-driver/mysql"
	"github.com/prometheus/common/log"
	"net/http"
	"time"
)
const (
	host = "ASeeker-transcription-database"
	//host = "tcp(127.0.0.1)"

	port     = 3306
	user     = "root"
	password = "toor"
	dbname   = "aseeker"
)

var psqlInfo = fmt.Sprintf("%s:%s@tcp(%s:3306)/%s", user,password, host, dbname)

func main() {
	time.Sleep(10*time.Second)
	var Database, err = sql.Open("mysql", psqlInfo)
	if err != nil {
		log.Fatal(err)
	}
	err = Database.Ping()
	if err != nil {
		log.Fatal(err)
	}


	log.Info("Setting Service Up On Port 1177")
	mux := http.DefaultServeMux
	mux.HandleFunc("/userauth/register", userAuth.RegisterUser)
}
