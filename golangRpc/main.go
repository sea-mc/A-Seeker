package main

import (
	"github.com/prometheus/common/log"
	"net/http"
	userAuth "./controller/UserAuthentication"
)

func main() {
	log.Info("Setting Service Up On Port 1177")
	mux := http.DefaultServeMux
	mux.HandleFunc("/userauth/register", userAuth.RegisterUser)
}
