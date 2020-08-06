package deepSpeech

import (
	"../../domain"
	"../../service/deepSpeech"
	"../../service/transcriptions"
	"encoding/json"
	"github.com/prometheus/common/log"
	"net/http"
	"strings"
)

//UploadMedia DeepSpeech controller is an external controller called by the frontend service.
//Upon receiving a multipart http request the contents are temporarily stored in memory, within a file descriptor,
//and then is passed to the DeepSpeech service for uploading. the JSON result of the upload is also returned.
func UploadMedia(w http.ResponseWriter, r *http.Request) {

	r.ParseMultipartForm(32 << 20) // limit your max input length!

	file, header, err := r.FormFile("file")
	if err != nil {
		log.Info(header)
		panic(err)
	}

	name := strings.ReplaceAll(r.URL.Query().Get("filename"), "'", "")

	transcription := domain.Transcription{
		Email:             r.URL.Query().Get("email"),
		Title:             name,
		Preview:           "Preview TODO",
		FullTranscription: nil,
		ContentFilePath:   "audio/" + name,
	}

	email := r.URL.Query().Get("email")
	if email == "" {
		w.WriteHeader(http.StatusNotAcceptable)
		log.Error("Upload media function received a request which has am empty email query value")
		return
	}

	//send the file
	log.Infof("Uploading Media File: %s for %s", name, r.URL.Query().Get("email"))
	response := deepSpeech.UploadMediaAsFile(w, file, name)
	r.Body.Close() //close the request body to save resources
	file.Close()   //close the media file

	//parse the processed transcription
	var transcriptionResponse []domain.TranscriptionToken

	err = json.NewDecoder(response.Body).Decode(&transcriptionResponse)
	if err != nil {
		log.Info(err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	//gather all tokens returned from processing
	var FullTranscriptions domain.TranscriptionTokens

	for _, e := range transcriptionResponse {
		token := domain.TranscriptionToken{
			Word: e.Word,
			Time: e.Time,
		}
		FullTranscriptions = append(FullTranscriptions, token)
	}

	transcription.FullTranscription = FullTranscriptions
	err = transcriptions.InsertTranscription(transcription)
	if err != nil {
		log.Error(err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusCreated)
}

//todo;
func DeleteMedia(w http.ResponseWriter, r *http.Request) {
}

//GetMedia DeepSpeech controller will perform a GET request on the DeepSpeech service.
//The filename performed within the GET is specified within a request URL query.
func GetMedia(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}
	name := r.URL.Query().Get("filename")
	if name == "" {
		w.WriteHeader(http.StatusBadRequest)
		return
	}
	log.Info("getting media for file " + name)
	b := deepSpeech.GetMedia(w, name)
	w.Write(b)
	return
}
