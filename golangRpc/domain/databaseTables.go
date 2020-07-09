package domain

type Account struct {
	Email    string `json:"email,omitempty"`
	Password string `json:"password,omitempty"`
}

type Transcription struct {
	Email                string               `json:"email,omitempty"`
	Title                string               `json:"title,omitempty"`
	Preview              string               `json:"preview,omitempty"`
	FullTranscription    []TranscriptionToken `json:"fulTranscription,omitempty"`
	RawFullTranscription []uint8              `json:"fullTranscription,omitempty"` //Mysql will return in base64 to save space, so we need an intermediary attribute
	ContentFilePath      string               `json:"contentFilePath,omitempty"`
}

type TranscriptionToken struct{
	Word string `json:"word"`
	Time interface{} `json:"time"`
}

type TranscriptionResponse []struct {
	Word string `json:"word"`
	Time interface{} `json:"time"`
}