package domain

type Account struct {
	Email    string `json:"email,omitempty"`
	Password string `json:"password,omitempty"`
}

type Transcription struct {
	Email             string `json:"email,omitempty"`
	Title             string `json:"title,omitempty"`
	Preview           string `json:"preview,omitempty"`
	FullTranscription string `json:"fullTranscription,omitempty"`
	ContentFilePath   string `json:"contentFilePath,omitempty"`
}
