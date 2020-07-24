package transcriptionStorage

import (
	"../../service/transcriptions"
	"encoding/json"
	"../../domain"
	"github.com/prometheus/common/log"
	"io/ioutil"
	"net/http"
)

func GetTranscriptions(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}

	email := r.URL.Query()["email"][0]
	if email == "" {
		w.WriteHeader(http.StatusInternalServerError)
		log.Error("Empty email was passed to delete user")
	}

	utranscriptions, err := transcriptions.GetTranscriptions(email)
	if err != nil {
		log.Error(err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	j, err := json.Marshal(utranscriptions)
	if err != nil {
		log.Error(err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	w.Write(j)
}

func GetTranscription(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}
	email := r.URL.Query()["email"][0]
	if email == "" {
		w.WriteHeader(http.StatusInternalServerError)
		log.Error("Empty email was passed to get transcription.")
	}

	title := r.URL.Query()["title"][0]
	if title == "" {
		w.WriteHeader(http.StatusInternalServerError)
		log.Error("Empty title was passed to get transcription.")
	}
	log.Info("Getting transcription " + title + " for user " + email)
	utranscription, err := transcriptions.GetTranscriptionByTitle(title)
	if err != nil {
		log.Error(err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	j, err := json.Marshal(utranscription)
	if err != nil {
		log.Error(err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	//DemojsonRecord, _ := json.Marshal(domain.Transcription{
	//	Email:             "test@test.com",
	//	Title:             "Transcription",
	//	Preview:           "This is a preview",
	//	FullTranscription: "this is the full transcription. I'm making this one a little longer since it will need to fill up a text box. not sure if this will help me, might copy paste something.",
	//	ContentFilePath:   "/filename.wav",
	//})

	w.Write(j)

}

func DeleteTranscription(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodDelete {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}
	email := r.URL.Query()["email"][0]
	if email == "" {
		w.WriteHeader(http.StatusBadRequest)
		log.Error("Empty email was passed to get transcription.")
	}

	title := r.URL.Query()["title"][0]
	if title == "" {
		w.WriteHeader(http.StatusBadRequest)
		log.Error("Empty title was passed to get transcription.")
	}
	log.Info("Removing transcription " + title + " for user " + email)
	if transcriptions.CheckForUser(email) {
		err := transcriptions.DeleteTranscription(title)
		if err != nil {
			log.Error(err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		w.WriteHeader(http.StatusGone)
		return
	}
	w.WriteHeader(http.StatusBadRequest)
}


func UpdateTranscription(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}
	email := r.URL.Query()["email"][0]
	if email == "" {
		w.WriteHeader(http.StatusBadRequest)
		log.Error("Empty email was passed to get transcription.")
	}

	title := r.URL.Query()["title"][0]
	if title == "" {
		w.WriteHeader(http.StatusBadRequest)
		log.Error("Empty title was passed to get transcription.")
	}
	tokens, err := ioutil.ReadAll(r.Body)
	if err != nil {
		log.Error(err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	log.Info(string(tokens))
	var allTokens domain.TranscriptionTokens
	err = json.Unmarshal(tokens, &allTokens)
	if err != nil {
		log.Error(err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	transcript := domain.Transcription{
		Email:                email,
		Title:                title,
		FullTranscription:    allTokens,
	}

	err = transcriptions.UpdateTranscription(transcript)
	if err != nil {
		log.Error(err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
}