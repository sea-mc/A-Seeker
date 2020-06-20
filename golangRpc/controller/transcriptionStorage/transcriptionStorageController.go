package transcriptionStorage

import (
	"../../domain"
	"encoding/json"
	"net/http"
)

func GetTranscriptions(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}

	j, _ := json.Marshal(domain.Transcription{
		Email:             "test@test.com",
		Title:             "Transcription",
		Preview:           "This is a preview",
		FullTranscription: "this is the full transcription",
		ContentFilePath:   "/filename.wav",
	})
	
	w.Write(j)
}

func GetTranscription(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}
}

func DeleteTranscription(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodDelete {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}

}
