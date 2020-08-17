package transcriptions

import (
	controller "../../controller/transcriptionStorage"
	"../../domain"
	"bytes"
	"encoding/json"
	"io/ioutil"
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestUpdateTranscriptionForTraining(t *testing.T) {

	b, e := ioutil.ReadFile("transcriptionService_test_resource_old")
	checkErr(t, e)
	testTranscription := domain.Transcription{}
	e = json.Unmarshal(b, &testTranscription)
	checkErr(t, e)
	oldTranscriptionBytes, e := json.Marshal(testTranscription.FullTranscription)
	checkErr(t, e)


	nb, e := ioutil.ReadFile("transcriptionService_test_resource_new")
	checkErr(t, e)
	e = json.Unmarshal(nb, &testTranscription)
	checkErr(t, e)
	newTranscriptionBytes, e := json.Marshal(testTranscription.FullTranscription)
	checkErr(t, e)


	req, err := http.NewRequest(http.MethodPost, "/transcriptions/update?title=test&email=test@test.com&testjson="+string(oldTranscriptionBytes), bytes.NewReader(newTranscriptionBytes))
	checkErr(t, err)



	rr := httptest.NewRecorder()
	handler := http.HandlerFunc(controller.UpdateTranscription)
	handler.ServeHTTP(rr, req)

	t.Log(rr.Code)

}

func checkErr(t *testing.T, err error){
	if err != nil {
		t.Error(err)
		t.FailNow()
	}
}