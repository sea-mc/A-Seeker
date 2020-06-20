package deepSpeech

import (
	"../../service/deepSpeech"
	"github.com/prometheus/common/log"
	"io/ioutil"
	"net/http"
)

func UploadMedia(w http.ResponseWriter, r *http.Request) {
	log.Info("GOT UPLOAD")

	defer r.Body.Close()

	bytes, err := ioutil.ReadAll(r.Body)

	if err != nil {
		log.Error(err)
	}

	deepSpeech.UploadMediaAsBytes(w, bytes)

}

func DeleteMedia(w http.ResponseWriter, r *http.Request) {

}

func GetMedia(w http.ResponseWriter, r *http.Request) {

}
