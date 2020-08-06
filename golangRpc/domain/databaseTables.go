package domain

//This file holds all database tables and associated JSON attribute values.

type Account struct {
	Email    string `json:"email,omitempty"`
	Password string `json:"password,omitempty"`
}

type Transcription struct {
	Email                string              `json:"email,omitempty"`
	Title                string              `json:"title,omitempty"`
	Preview              string              `json:"preview,omitempty"`
	FullTranscription    TranscriptionTokens `json:"fulTranscription,omitempty"`
	RawFullTranscription []byte              `json:"fullTranscription,omitempty"` //Mysql will return in base64 to save space, so we need an intermediary attribute
	ContentFilePath      string              `json:"contentFilePath,omitempty"`
}

type TranscriptionToken struct {
	Time float64 `json:"time"`
	Word string  `json:"word"`
}

type TranscriptionTokens []struct {
	Time float64 `json:"time"`
	Word string  `json:"word"`
}
