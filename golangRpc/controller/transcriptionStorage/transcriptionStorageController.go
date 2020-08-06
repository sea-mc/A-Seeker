package transcriptionStorage

import (
	"../../domain"
	"../../service/transcriptions"
	"encoding/json"
	"github.com/prometheus/common/log"
	"io/ioutil"
	"net/http"
)

//GetTranscriptions Transcription Storage Controller - Called by the UI to get all transcriptions owned by a specified email.
//all values are specified as URL queries (?email='email').
func GetTranscriptions(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet { //use HTTP methods properly
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}

	email := r.URL.Query()["email"][0] //Get the user email. We must index as the query method is variadic.
	if email == "" {
		w.WriteHeader(http.StatusInternalServerError)
		log.Error("Empty email was passed to get transcriptions")
	}

	//utilize the transcription storage service to get all records belonging to the specified email.
	utranscriptions, err := transcriptions.GetTranscriptions(email)
	if err != nil {
		log.Error(err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	//turn the database result into JSON and give it to the frontend
	j, err := json.Marshal(utranscriptions)
	if err != nil {
		log.Error(err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	w.Write(j)
}

//GetTranscription transcription storage controller. This endpoint is called by the UI
//to get a specific transcription record. This is done when a user selects an entry in the transcription list.
//two parameters must be specified within the URL query, email and title.
func GetTranscription(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet { //use HTTP methods properly
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}
	email := r.URL.Query()["email"][0] //Get the user email. We must index as the query method is variadic.
	if email == "" {
		w.WriteHeader(http.StatusInternalServerError)
		log.Error("Empty email was passed to get transcription.")
	}

	title := r.URL.Query()["title"][0] //Get the transcription, again a variadic result.
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
	//turn the database results into JSON and return it to the frontend.
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

//DeleteTranscription transcription storage controller - Currently unused, as no UI is implemented to call this endpoint.
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

//UpdateTranscription transcription storage controller - Called by the UI when a user saves a modified transcription.
//Accepts two parameters within the URL query, email and title. Also accepts a JSON request body, which will be applied to the database.
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

	var allTokens domain.TranscriptionTokens
	err = json.Unmarshal(tokens, &allTokens)
	if err != nil {
		log.Error(err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	transcript := domain.Transcription{
		Email:             email,
		Title:             title,
		FullTranscription: allTokens,
	}

	err = transcriptions.UpdateTranscription(transcript)
	if err != nil {
		log.Error(err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
}
