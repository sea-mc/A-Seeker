package UserAuthentication

import (
	"../../service/userAuth"
	"encoding/json"
	"github.com/google/uuid"
	"github.com/prometheus/common/log"
	"net/http"
	"sync"
)

var Auth struct {
	sync.RWMutex
	Map map[uuid.UUID]string
}

func InitAuthMap() {
	Auth.Map = make(map[uuid.UUID]string)
}

func RegisterUser(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}

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

	err := userAuth.RegisterUser(email, password)
	CheckNetworkError(w, err)

}

//Checks if a registered user exists in the userAuth
func CheckForUser(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}
	email, err := r.URL.Query()["email"]
	if err {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	if userAuth.CheckIfUserIsRegistered(email[0]) {
		//user is registered
		w.WriteHeader(http.StatusFound)
	} else {
		w.WriteHeader(http.StatusNotFound)
	}
	er := r.Body.Close()
	CheckNetworkError(nil, er)

}

func DeleteRegisteredUser(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodDelete {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}
	email := r.URL.Query()["email"][0]
	if email == "" {
		w.WriteHeader(http.StatusInternalServerError)
		log.Error("Empty email was passed to delete user")
	}

	if !userAuth.CheckIfUserIsRegistered(email) {
		w.WriteHeader(http.StatusNotFound)
		return
	}

	e := userAuth.DeleteUser(email)
	CheckNetworkError(w, e)

}

func LoginUser(w http.ResponseWriter, r *http.Request) {
	log.Info("get a login request")
	if r.Method != http.MethodPost {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}

	email := r.URL.Query()["email"][0]
	if email == "" {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	if !userAuth.CheckIfUserIsRegistered(email) {
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	accessToken := uuid.New()
	j, _ := json.Marshal(accessToken)
	Auth.Lock()
	Auth.Map[accessToken] = email
	Auth.Unlock()
	w.Write(j)
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
