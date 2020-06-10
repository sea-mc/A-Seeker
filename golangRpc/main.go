package main

import (
	userAuthController "./controller/UserAuthentication"
	userAuthService "./service/userAuth"

	deepSpeechController "./controller/deepSpeech"
	transcriptionStorageController "./controller/transcriptionStorage"
	"github.com/prometheus/common/log"
	"net/http"
)

func main() {
	userAuthService.InitDatabaseConn()
	log.Info("Setting Service Up On Port 1177")
	mux := http.DefaultServeMux

	//userAuthController API
	mux.HandleFunc("/userauth/register/new", userAuthController.RegisterUser)
	mux.HandleFunc("/userauth/register/check", userAuthController.CheckForUser)
	mux.HandleFunc("/userauth/register/delete", userAuthController.DeleteRegisteredUser)
	mux.HandleFunc("/userauth/register/login", userAuthController.LoginUser)

	//Transcription Storage API
	mux.HandleFunc("/transcriptions/get/all", transcriptionStorageController.GetTranscriptions)
	mux.HandleFunc("/transcriptions/get/single", transcriptionStorageController.GetTranscription)
	mux.HandleFunc("/transcriptions/delete", transcriptionStorageController.DeleteTranscription)

	//deepSpeech API
	mux.HandleFunc("/deepSpeech/media/upload", deepSpeechController.UploadMedia)
	mux.HandleFunc("/deepSpeech/media/delete", deepSpeechController.DeleteMedia)
	mux.HandleFunc("/deepSpeech/media/get", deepSpeechController.GetMedia)

	log.Info("Service Up On Port 1177")
}
