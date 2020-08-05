package deepSpeech

import (
	"../../domain"
	"../../service/deepSpeech"
	"../../service/transcriptions"
	"bytes"
	"encoding/json"
	"github.com/prometheus/common/log"
	"io"
	"io/ioutil"
	"net/http"
	"strings"
)

func UploadMedia(w http.ResponseWriter, r *http.Request) {

	defer r.Body.Close()
	r.ParseMultipartForm(32 << 20) // limit your max input length!
	var buf bytes.Buffer

	file, header, err := r.FormFile("file")
	if err != nil {
		log.Info(header)
		panic(err)
	}
	defer file.Close()
	name := r.URL.Query().Get("filename")
	nameStr := strings.ReplaceAll(string(name), "'", "")
	transcription := domain.Transcription{
		Email:             r.URL.Query().Get("email"),
		Title:             nameStr,
		Preview:           "Preview TODO",
		FullTranscription: nil,
		ContentFilePath:   "audio/" + nameStr,
	}
	email := r.URL.Query().Get("email")
	if email == "" {
		w.WriteHeader(http.StatusNotAcceptable)
		log.Error("Upload media function received a request which has am empty email query value")
		return
	}
	//send the file
	log.Infof("Uploading Media File: %s for %s",nameStr,r.URL.Query().Get("email"))
	response := deepSpeech.UploadMediaAsFile(w, file, nameStr)
	io.Copy(&buf, file)
	buf.Reset()
	log.Info("Upload media has returned")

	var transcriptionResponse []domain.TranscriptionToken
	fullTranscription, err := ioutil.ReadAll(response.Body)
	if err != nil {
		log.Error(err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	log.Info(string(fullTranscription))
	err = json.Unmarshal(fullTranscription, &transcriptionResponse)
	if err != nil {
		log.Info(err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	var FullTranscriptions domain.TranscriptionTokens
	for _, e := range transcriptionResponse {
		token := domain.TranscriptionToken{
			Word: e.Word,
			Time: e.Time,
		}
		FullTranscriptions = append(FullTranscriptions, token)
	}

	transcription.FullTranscription = FullTranscriptions
	j, _ := json.Marshal(transcription)
	err = transcriptions.InsertTranscription(transcription)
	if err != nil {
		log.Error(err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	w.Write(j)
}

func DeleteMedia(w http.ResponseWriter, r *http.Request) {
	//todo;
}

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
