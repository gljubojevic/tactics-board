package main

import (
	_ "embed"
	"encoding/json"
	"fmt"
	"io"
	"io/ioutil"
	"net/http"
	"os"
	"sort"
	"strconv"
	"strings"
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

// some details for manipulation
type TacticDetails struct {
	ID          string    `json:"id"`
	Name        string    `json:"name"`
	Description string    `json:"description"`
	Created     time.Time `json:"created"`
	Updated     time.Time `json:"updated"`
	DocRef      string    `json:"docRef"`
	Thumbnail   string    `json:"thumbnail"`
}

func main() {
	fmt.Println("Starting server")
	defer fmt.Println("Stopped server")

	// Create the uploads folder if it doesn't already exist
	err := os.MkdirAll("./uploads", os.ModePerm)
	if err != nil {
		fmt.Printf("error %v\n", err)
		return
	}

	// Handle embedded, must be in folder below command folder
	//http.Handle("/tactics-board/", http.StripPrefix("/tactics-board/", http.FileServer(http.FS(content))))
	// Must not strip prefix because react is configured to home route /tactics-board
	//http.Handle("/tactics-board/", http.FileServer(http.FS(content)))

	// Handle direct from build folder
	http.Handle("/tactics-board/", http.StripPrefix("/tactics-board", http.FileServer(http.Dir("../../../build"))))

	// Handle uploaded files from uploads folder
	http.Handle("/uploads/", http.StripPrefix("/uploads", http.FileServer(http.Dir("./uploads"))))

	// Handle ext logos and adds
	http.Handle("/TacticsBoard/ext/", http.StripPrefix("/TacticsBoard/ext/", http.FileServer(http.Dir("../../../build/ext"))))

	// emulate routes for tactics board
	http.HandleFunc("/Account/LoginRegister", login)
	http.HandleFunc("/Account/LogOff", logout)
	http.HandleFunc("/Account/GetUser", getUser)
	http.HandleFunc("/TacticsBoard/SaveTactic", tacticsSave)
	http.HandleFunc("/TacticsBoard/GetTacticsList", tacticsList)
	http.HandleFunc("/TacticsBoard/TacticsLoad", tacticsLoad)
	http.HandleFunc("/TacticsBoard/TacticsLoadShared", tacticsLoad)
	http.HandleFunc("/TacticsBoard/DeleteTactic", tacticsDelete)

	// start server same as npm
	err = http.ListenAndServe(":3000", nil)
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
	fmt.Printf("logout %s\n", req.Method)
	if req.Method != "POST" {
		w.WriteHeader(http.StatusForbidden)
		return
	}
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

func isLoggedIn(w http.ResponseWriter, req *http.Request) bool {
	sessionCookie, err := req.Cookie(session_cookie_name)
	if err != nil {
		fmt.Printf("get-user error %v\n", err)
		w.WriteHeader(http.StatusForbidden)
		return false
	}

	if sessionCookie.Value != sessionID {
		fmt.Printf("get-user error invalid session %v need %v\n", sessionCookie.Value, sessionID)
		w.WriteHeader(http.StatusForbidden)
		return false
	}
	return true
}

func getUser(w http.ResponseWriter, req *http.Request) {
	fmt.Printf("get-user\n")
	if !isLoggedIn(w, req) {
		return
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

func tacticsSave(w http.ResponseWriter, req *http.Request) {
	fmt.Printf("tactics-save\n")
	if !isLoggedIn(w, req) {
		return
	}

	err := req.ParseMultipartForm(1024 * 500)
	if nil != err {
		fmt.Printf("tactics-save error %v\n", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	if !req.Form.Has("tactics") {
		fmt.Printf("tactics-save error missing tactics data\n")
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	tacticsDetails := TacticDetails{}
	tacticsJSON := req.Form.Get("tactics")
	err = json.Unmarshal([]byte(tacticsJSON), &tacticsDetails)
	if err != nil {
		fmt.Printf("tactics-save error unmarshal tactics %v\n", err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	err = ioutil.WriteFile("./uploads/"+tacticsDetails.ID+".json", []byte(tacticsJSON), 0644)
	if err != nil {
		fmt.Printf("tactics-save error saving tactics %v\n", err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	tmb, hdr, err := req.FormFile("thumbnail")
	if nil != err {
		fmt.Printf("tactics-save error missing tactics thumbnail\n")
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	defer tmb.Close()

	// Create a new file in the uploads directory
	dst, err := os.Create(fmt.Sprintf("./uploads/%s", hdr.Filename))
	if err != nil {
		fmt.Printf("tactics-save error saving tactics thumbnail %v\n", err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer dst.Close()

	// Copy the uploaded file to the filesystem
	// at the specified destination
	_, err = io.Copy(dst, tmb)
	if err != nil {
		fmt.Printf("tactics-save error saving tactics thumbnail %v\n", err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}

func tacticsList(w http.ResponseWriter, req *http.Request) {
	fmt.Printf("tactics-list\n")
	if !isLoggedIn(w, req) {
		return
	}

	// optional param
	afterID := req.URL.Query().Get("after")

	// required per page
	sPerPage := req.URL.Query().Get("perPage")
	if sPerPage == "" {
		fmt.Printf("tactics-list error missing perPage param\n")
		http.Error(w, "tactics-list error missing perPage param", http.StatusInternalServerError)
		return
	}

	perPage, err := strconv.Atoi(sPerPage)
	if err != nil {
		fmt.Printf("tactics-list error invalid perPage param %v\n", err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	files, err := ioutil.ReadDir("./uploads")
	if err != nil {
		fmt.Printf("tactics-list error reading uploads folder %v\n", err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	allTactics := make([]*TacticDetails, 0)

	// all tactics list
	for _, f := range files {
		if !strings.HasSuffix(f.Name(), ".json") {
			continue
		}
		fmt.Printf("tactics-list reading %v\n", f.Name())
		tdta, err := ioutil.ReadFile("./uploads/" + f.Name())
		if err != nil {
			fmt.Printf("tactics-list error reading uploads file %v\n", err)
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		tactics := TacticDetails{}
		err = json.Unmarshal(tdta, &tactics)
		if err != nil {
			fmt.Printf("tactics-list error reading uploads file %v\n", err)
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		// set tumbnail path and ref
		tactics.Thumbnail = "/uploads/" + tactics.ID + ".png"
		tactics.DocRef = tactics.ID
		allTactics = append(allTactics, &tactics)
	}

	// sort
	sort.Slice(allTactics, func(i, j int) bool {
		return allTactics[i].Updated.After(allTactics[j].Updated)
	})

	idx := 0
	if "" != afterID {
		// find index to start from
		for i := 0; i < len(allTactics); i++ {
			if allTactics[i].ID == afterID {
				idx = i + 1
				break
			}
		}
	}

	idxEnd := idx + perPage
	if idxEnd >= len(allTactics) {
		idxEnd = len(allTactics)
	}
	showTactics := allTactics[idx:idxEnd]

	JSON, err := json.Marshal(showTactics)
	if err != nil {
		fmt.Printf("tactics-list error marshal tactics %v\n", err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	_, err = w.Write(JSON)
	if err != nil {
		fmt.Printf("tactics-list error respond tactics %v\n", err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}

func tacticsLoad(w http.ResponseWriter, req *http.Request) {
	fmt.Printf("tactics-load\n")
	if !isLoggedIn(w, req) {
		return
	}

	id := req.URL.Query().Get("t")
	if id == "" {
		fmt.Printf("tactics-load error missing t param\n")
		http.Error(w, "tactics-load error missing t param", http.StatusInternalServerError)
		return
	}

	fname := id + ".json"
	fmt.Printf("tactics-load reading %v\n", id)
	JSON, err := ioutil.ReadFile("./uploads/" + fname)
	if err != nil {
		fmt.Printf("tactics-load error reading file %v\n", err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	_, err = w.Write(JSON)
	if err != nil {
		fmt.Printf("tactics-load error %v\n", err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}

func tacticsDelete(w http.ResponseWriter, req *http.Request) {
	fmt.Printf("tactics-delete\n")
	if req.Method != "POST" {
		w.WriteHeader(http.StatusForbidden)
		return
	}
	if !isLoggedIn(w, req) {
		return
	}

	id := req.URL.Query().Get("t")
	if id == "" {
		fmt.Printf("tactics-delete error missing t param\n")
		http.Error(w, "tactics-delete error missing t param", http.StatusInternalServerError)
		return
	}

	fname := id + ".json"
	fmt.Printf("tactics-delete %v\n", fname)
	err := os.Remove("./uploads/" + fname)
	if err != nil {
		fmt.Printf("tactics-delete error deleting file %v\n", err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	fname = id + ".png"
	fmt.Printf("tactics-delete %v\n", fname)
	err = os.Remove("./uploads/" + fname)
	if err != nil {
		fmt.Printf("tactics-delete error deleting file %v\n", err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}
