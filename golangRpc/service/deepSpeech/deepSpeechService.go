package deepSpeech

import (
	"github.com/prometheus/common/log"
	"io/ioutil"
	"mime/multipart"
	"net/http"
)

func GetMedia(w http.ResponseWriter, fileName string) []byte{
	log.Info("http://deepspeech:5000/get/"+fileName)
	req, err := http.NewRequest(http.MethodGet, "http://deepspeech:5000/get/"+fileName, nil)
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


func UploadMediaAsFile(w http.ResponseWriter, file multipart.File, fileName string) *http.Response {
	log.Info("Sending an upload")
	req, err := http.NewRequest(http.MethodPost, "http://deepspeech:5000/upload/"+fileName, file)
	if NetworkErr(w, err) {
		return &http.Response{}
	}
	resp, err := http.DefaultClient.Do(req)
	if NetworkErr(w, err) {
		return &http.Response{}
	}
	log.Info("Upload Sent")
	return resp
}

func NetworkErr(w http.ResponseWriter, err error) bool {
	if err != nil {
		log.Error(err)
		w.WriteHeader(http.StatusInternalServerError)
		return true
	}
	return false
}