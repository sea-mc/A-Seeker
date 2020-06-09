package main

import (
	userAuth "./controller/UserAuthentication"
	"database/sql"
	_ "github.com/go-sql-driver/mysql"
	"github.com/prometheus/common/log"
	"net/http"
)

var Database, err = sql.Open("mysql", "root:toor@tcp(127.0.0.1:3306)/aseeker")

func main() {
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
