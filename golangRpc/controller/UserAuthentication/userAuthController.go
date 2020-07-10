package UserAuthentication

import (
	"../../service/userAuth"

	"github.com/prometheus/common/log"
	"net/http"
)

func RegisterUser(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		log.Errorf("register user got bad http method; expected POST got " + r.Method)
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}
	log.Info("Attempting to register user ")

	email := r.URL.Query()["email"][0]
	if email == "" {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	password := r.URL.Query()["password"][0]
	if password == "" {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	if userAuth.CheckForUser(email) {
		w.WriteHeader(http.StatusBadRequest)
	}
	err := userAuth.RegisterUser(email, password)
	CheckNetworkError(w, err)

}

//Checks if a registered user exists in the userAuth
func CheckUser(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}
	email, err := r.URL.Query()["email"]
	if err {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	if userAuth.CheckForUser(email[0]) {
		//user is registered
		w.WriteHeader(http.StatusFound)
	} else {
		w.WriteHeader(http.StatusNotFound)
	}
	er := r.Body.Close()
	CheckNetworkError(nil, er)

}

func DeleteRegisteredUser(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		log.Error("Delete user got bad http method")
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}
	email := r.URL.Query()["email"][0]
	if email == "" {
		w.WriteHeader(http.StatusInternalServerError)
		log.Error("Empty email was passed to delete user")
	}

	if !userAuth.CheckForUser(email) {
		w.WriteHeader(http.StatusNotFound)
		return
	}
	log.Info("removing all transcriptions for " + email)
	e := userAuth.DeleteTranscriptions(email)
	CheckNetworkError(w, e)
	log.Info("De-Registering " + email)
	e = userAuth.DeleteUser(email)
	CheckNetworkError(w, e)
	w.WriteHeader(http.StatusOK)
}

func LoginUser(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		log.Errorf("Login User got bad http method; expected POST got " + r.Method)
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}
	log.Info("Attempting to log user in")
	email := r.URL.Query()["email"][0]
	if email == "" {
		w.WriteHeader(http.StatusBadRequest)
		return
	}
	log.Info("user email = " + email)
	password := r.URL.Query()["password"][0]
	if password == "" {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	if !userAuth.LoginUser(email, password) {
		log.Errorf("Login attempt failed for email address " + email)
		w.WriteHeader(http.StatusUnauthorized)
		return
	}
	w.WriteHeader(http.StatusAccepted)
	log.Info(email + " has logged in")
}

func CheckNetworkError(w http.ResponseWriter, err error) bool {
	if err != nil {
		if w != nil {
			log.Error(err)
			w.WriteHeader(http.StatusInternalServerError)
		}
		return false
	}
	return true
}
