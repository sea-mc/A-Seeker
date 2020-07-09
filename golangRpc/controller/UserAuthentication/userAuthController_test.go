package UserAuthentication

//
//func TestCheckUser(t *testing.T) {
//	//invalid method test
//	req, err := http.NewRequest(http.MethodGet, "/userauth/register/check?email=a", nil)
//	if err != nil {
//		log.Error(err)
//		t.Fail()
//	}
//
//	requestRecorder := httptest.NewRecorder()
//	webpageHandler := http.HandlerFunc(CheckUser)
//	webpageHandler.ServeHTTP(requestRecorder, req)
//	resp := requestRecorder.Result()
//	if resp.StatusCode != http.StatusInternalServerError {
//		t.Fail()
//		log.Error(resp.StatusCode)
//	}
//}
//
//func TestDeleteRegisteredUser(t *testing.T) {
//	//invalid method test
//	req, err := http.NewRequest(http.MethodGet, "/userauth/register/delete?email=a", nil)
//	if err != nil {
//		log.Error(err)
//		t.Fail()
//	}
//
//	requestRecorder := httptest.NewRecorder()
//	webpageHandler := http.HandlerFunc(RegisterUser)
//	webpageHandler.ServeHTTP(requestRecorder, req)
//	resp := requestRecorder.Result()
//	if resp.StatusCode != http.StatusMethodNotAllowed {
//		t.Fail()
//		log.Error(resp.StatusCode)
//	}
//}
//
//func TestLoginUser(t *testing.T) {
//	//invalid method test
//	req, err := http.NewRequest(http.MethodGet, "/userauth/register/login?email=a&password=b", nil)
//	if err != nil {
//		log.Error(err)
//		t.Fail()
//	}
//
//	requestRecorder := httptest.NewRecorder()
//	webpageHandler := http.HandlerFunc(LoginUser)
//	webpageHandler.ServeHTTP(requestRecorder, req)
//	resp := requestRecorder.Result()
//	if resp.StatusCode != http.StatusMethodNotAllowed {
//		t.Fail()
//		log.Error(resp.StatusCode)
//	}
//}
//
//func TestRegisterUser(t *testing.T) {
//	//invalid method test
//	req, err := http.NewRequest(http.MethodGet, "/userauth/register/register?email=a&password=b", nil)
//	if err != nil {
//		log.Error(err)
//		t.Fail()
//	}
//
//	requestRecorder := httptest.NewRecorder()
//	webpageHandler := http.HandlerFunc(RegisterUser)
//	webpageHandler.ServeHTTP(requestRecorder, req)
//	resp := requestRecorder.Result()
//	if resp.StatusCode != http.StatusMethodNotAllowed {
//		t.Fail()
//		log.Error(resp.StatusCode)
//	}
//}
