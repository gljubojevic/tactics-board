package main

import (
	_ "embed"
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/google/uuid"
)

// content is static web server content.
// cp -r ../../../build/ ./tactics-board
/////go:embed tactics-board
//var content embed.FS

//go:embed login.html
var loginForm []byte

// userData is minimal structure for specific user
type UserData struct {
	DisplayName string `json:"displayName"`
	PhotoURL    string `json:"photoURL"`
}

const session_cookie_name = "tactics-session"

// currently logged user
var loggedUser *UserData
var sessionID string

func main() {
	fmt.Println("Starting server")
	defer fmt.Println("Stopped server")

	// Handle embedded, must be in folder below command folder
	//http.Handle("/tactics-board/", http.StripPrefix("/tactics-board/", http.FileServer(http.FS(content))))
	// Must not strip prefix because react is configured to home route /tactics-board
	//http.Handle("/tactics-board/", http.FileServer(http.FS(content)))

	// Handle direct from build folder
	http.Handle("/tactics-board/", http.StripPrefix("/tactics-board", http.FileServer(http.Dir("../../../build"))))

	// emulate routes for tactics board
	http.HandleFunc("/login", login)
	http.HandleFunc("/logout", logout)
	http.HandleFunc("/get-user", getUser)

	// start server same as npm
	err := http.ListenAndServe(":3000", nil)
	if nil != err {
		fmt.Printf("error %v\n", err)
	}
}

func showLogin(w http.ResponseWriter) {
	w.Header().Set("Content-Type", "text/html; charset=UTF-8")
	_, err := w.Write(loginForm)
	if nil != err {
		fmt.Printf("error %v\n", err)
	}
}

func login(w http.ResponseWriter, req *http.Request) {
	fmt.Printf("login\n")
	if req.Method == "GET" {
		showLogin(w)
		return
	}

	err := req.ParseForm()
	if nil != err {
		showLogin(w)
		fmt.Printf("login error %v\n", err)
		return
	}

	user := req.Form.Get("username")
	pass := req.Form.Get("password")
	if user != "gljubojevic" || pass != "test" {
		showLogin(w)
		fmt.Printf("login error username:%s password:%s\n", user, pass)
		return
	}

	// fake session and user data
	sessionID = uuid.NewString()
	loggedUser = &UserData{
		DisplayName: "Goran Ljubojevic",
		PhotoURL:    "",
	}
	returnURL := req.URL.Query()["rurl"][0]

	cookie := http.Cookie{
		Path:    "/",
		Name:    session_cookie_name,
		Value:   sessionID,
		Expires: time.Now().Add(10 * time.Minute),
	}
	http.SetCookie(w, &cookie)
	http.Redirect(w, req, returnURL, http.StatusFound)
}

func logout(w http.ResponseWriter, req *http.Request) {
	fmt.Printf("logout\n")
	sessionID = ""
	loggedUser = nil
	returnURL := req.URL.Query()["rurl"][0]

	_, err := req.Cookie(session_cookie_name)
	if err != nil {
		fmt.Printf("logout error %v\n", err)
		http.Redirect(w, req, returnURL, http.StatusFound)
		return
	}

	// invalidate cookie
	cookie := http.Cookie{
		Path:    "/",
		Name:    session_cookie_name,
		MaxAge:  -1,
		Expires: time.Now().Add(-10 * time.Minute),
	}

	http.SetCookie(w, &cookie)
	http.Redirect(w, req, returnURL, http.StatusFound)
}

func getUser(w http.ResponseWriter, req *http.Request) {
	fmt.Printf("get-user\n")
	sessionCookie, err := req.Cookie(session_cookie_name)
	if err != nil {
		fmt.Printf("get-user error %v\n", err)
		w.WriteHeader(http.StatusForbidden)
		return
	}

	if sessionCookie.Value != sessionID {
		fmt.Printf("get-user error invalid session %v need %v\n", sessionCookie.Value, sessionID)
		w.WriteHeader(http.StatusForbidden)
	}

	JSON, err := json.Marshal(loggedUser)
	if err != nil {
		fmt.Printf("get-user error %v\n", err)
		w.WriteHeader(http.StatusForbidden)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	_, err = w.Write(JSON)
	if err != nil {
		fmt.Printf("get-user error %v\n", err)
		w.WriteHeader(http.StatusForbidden)
		return
	}
}
