package deepSpeech

import (
	"github.com/prometheus/common/log"
	"io/ioutil"
	"mime/multipart"
	"net/http"
)

func GetMedia(w http.ResponseWriter, fileName string) []byte{
	req, err := http.NewRequest(http.MethodGet, "http://localhost:1178/"+fileName, nil)
	if NetworkErr(w, err) {
		return nil
	}
	resp, err := http.DefaultClient.Do(req)
	if NetworkErr(w, err) {
		return nil
	}
	b, err := ioutil.ReadAll(resp.Body)
	if NetworkErr(w,err){
		return nil
	}
	resp.Body.Close()
	return b
}


func UploadMediaAsFile(w http.ResponseWriter, file multipart.File) {
	log.Info("Sending an upload")
	req, err := http.NewRequest(http.MethodPost, "http://deepspeech:1178/", file)
	if NetworkErr(w, err) {
		return
	}
	resp, err := http.DefaultClient.Do(req)
	if NetworkErr(w, err) {
		return
	}
	w.WriteHeader(resp.StatusCode)
	log.Info("Upload Sent")
}

func NetworkErr(w http.ResponseWriter, err error) bool {
	if err != nil {
		log.Error(err)
		w.WriteHeader(http.StatusInternalServerError)
		return true
	}
	return false
}