package deepSpeech

import (
	"../../service/deepSpeech"
	"bytes"
	"fmt"
	"github.com/prometheus/common/log"
	"io"
	"net/http"
	"strings"
)

func UploadMedia(w http.ResponseWriter, r *http.Request) {
	log.Info("GOT UPLOAD")
	defer r.Body.Close()
	r.ParseMultipartForm(32 << 20) // limit your max input length!
	var buf bytes.Buffer
	// in your case file would be fileupload
	file, header, err := r.FormFile("file")
	if err != nil {
		log.Info(header)
		panic(err)
	}
	defer file.Close()

	//send the file

	name := strings.Split(header.Filename, ".")
	deepSpeech.UploadMediaAsFile(w, file, name[0])
	fmt.Printf("File name %s\n", name[0])
	io.Copy(&buf, file)
	buf.Reset()
	log.Info("Upload media has returned")

}

func DeleteMedia(w http.ResponseWriter, r *http.Request) {

}

func GetMedia(w http.ResponseWriter, r *http.Request) {

}
