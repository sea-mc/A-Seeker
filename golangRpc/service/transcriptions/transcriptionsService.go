package transcriptions

import (
	"../../domain"
	"github.com/pkg/errors"
	"github.com/prometheus/common/log"
)

func GetTranscriptions(email string) ([]domain.Transcription, error) {

	log.Error("No Transcriptions Found for email " + email)
	return nil, errors.New("No Transcriptions Found for email " + email)
}

func GetTranscriptionByTitle(title string) (domain.Transcription, error) {

}

func InsertTranscription(transcription domain.Transcription) error {

	//todo; enforce unique titles

	return errors.New("Err")
}

func DeleteTranscription(transcriptionTitle string) error {

	return nil
}
