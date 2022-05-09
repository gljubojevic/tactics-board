import { rootShouldForwardProp } from "@mui/material/styles/styled";

class CoatchingfutsalServer {
	constructor(
		signInURL = null, 
		signOutURL = null, 
		getUserURL = null, 
		signedInCallback = null,
		saveURL = null,
		loadURL = null,
		loadSharedURL = null,
		listURL = null,
		deleteURL = null
	) {
		this.signInURL = signInURL;
		this.signOutURL = signOutURL;
		this.getUserURL = getUserURL;
		this.getUserInterval = 5 * 60 * 1000; // every 5min
		this.signedInCallback = signedInCallback;
		this.saveURL = saveURL;
		this.loadURL = loadURL;
		this.loadSharedURL = loadSharedURL;
		this.listURL = listURL;
		this.deleteURL = deleteURL;
	}

	get AppInstance() {
		return null;
	}

	signInOutRedirect(operation, goToURL){
		const l = document.location;
		let returnURL = l.href;
		let url = l.protocol + '//' + l.host + goToURL + '?rurl=' + encodeURIComponent(returnURL);
		console.log(operation, l, returnURL, url);
		document.location = url;
	}

	SignIn() {
		this.signInOutRedirect("SignIn", this.signInURL);
	}

	async SignOut() {
		this.signInOutRedirect("SignOut", this.signOutURL);
	}

	async getUser(){
		//console.log("getting user info");
		const l = document.location;
		let url = l.protocol + '//' + l.host + this.getUserURL;
		const response = await fetch(url, {
			mode:"same-origin",
			cache:"no-cache",
			redirect:"error"
		})
		.then(rsp => {
			//console.log("getUser response", rsp);
			if (rsp.status == 200) {
				return rsp.json()
			}
			return null;
		})
		.catch(error => console.error(error));
		if (response) {
			this.signedInCallback(response);
		}
	}

	UserChangesSubscribe() {
		// try fetch
		this.getUser();
		// now repeat for duration
		this.userChecks = setInterval(() => {
			this.getUser()
		}, this.getUserInterval);
	}

	UserChangesUnsubscribe() {
		if (this.userChecks) {
			clearInterval(this.userChecks);
		}
	}

	async List(tacticsPerPage, afterDoc) {
		let tacticsList = [];
		return tacticsList;
	}

	async Save(tactics, thumbnailBlob) {
		//console.log("saving tactics");
		const l = document.location;
		let url = l.protocol + '//' + l.host + this.saveURL;

		const formData = new FormData();
		formData.append("tactics", JSON.stringify(tactics));
		formData.append("thumbnail", thumbnailBlob, tactics.id + '.png');
		await fetch(url, {
			method: "POST",
			mode:"same-origin",
			cache:"no-cache",
			redirect:"error",
			body: formData
		})
		.then(rsp => {
			console.log("saving tactics response", rsp);
			return rsp.status;
		})
		.catch(error => console.error(error));
	}

	async Load(tacticsID) {
		return null;
	}

	async LoadShared(tacticsID) {
		return null;
	}

	async Delete(tacticsID) {
	}
}

export default CoatchingfutsalServer;