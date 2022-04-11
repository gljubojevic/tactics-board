package main

import (
	//"embed"
	"fmt"
	"net/http"
)

// content is static web server content.
// cp -r ../../../build/ ./tactics-board
//go:embed tactics-board
//var content embed.FS

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
	http.HandleFunc("/get-user", getUser)

	// start server same as npm
	http.ListenAndServe(":3000", nil)
}

func login(w http.ResponseWriter, req *http.Request) {
	fmt.Fprintf(w, "login\n")
}

func getUser(w http.ResponseWriter, req *http.Request) {
	fmt.Fprintf(w, "get-user\n")
}
