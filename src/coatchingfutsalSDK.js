class CoatchingfutsalServer {
	constructor(
		siteHomeURL = null,
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
		this.siteHomeURL = siteHomeURL;
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

	hasHomeURL() {
		return null !== this.siteHomeURL;
	}

	goHomeURL() {
		if (!this.hasHomeURL) {
			return;
		}
		document.location = this.siteHomeURL;
	}

	async SignIn() {
		const l = document.location;
		let returnURL = l.href;
		let url = l.protocol + '//' + l.host + this.signInURL + '?rurl=' + encodeURIComponent(returnURL);
		//console.log("SignIn", l, returnURL, url);
		document.location = url;
	}

	async SignOut() {
		document.getElementById('logoutForm').submit()
		/*
		const l = document.location;
		let returnURL = l.href;
		let url = l.protocol + '//' + l.host + this.signOutURL + '?rurl=' + encodeURIComponent(returnURL);
		//console.log("SignOut", l, returnURL, url);
		await fetch(url, {
			method: "POST",
			mode:"same-origin",
			cache:"no-cache",
			body:formData
		})
		.then(rsp => {
			if (rsp.redirected) {
				document.location = rsp.url;
				return;
			}
			console.log(rsp);
		})
		.catch(error => console.error(error));
		*/
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
			if (rsp.status === 200) {
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

	async List(tacticsPerPage, afterDoc, dateFrom, dateTo, searchText) {
		//console.log("listing tactics");
		const l = document.location;
		let url = l.protocol + '//' + l.host + this.listURL + "?perPage=" + tacticsPerPage;
		if (afterDoc && afterDoc.length > 0) {
			url += "&after=" + afterDoc;
		}
		if (dateFrom) {
			url += "&dateFrom=" + encodeURIComponent(dateFrom);
		}
		if (dateTo) {
			url += "&dateTo=" + encodeURIComponent(dateTo);
		}
		if (searchText) {
			url += "&searchText=" + encodeURIComponent(searchText);
		}
		//console.log("List", url);

		let tacticsList = await fetch(url, {
			mode:"same-origin",
			cache:"no-cache",
			redirect:"error"
		})
		.then(rsp => {
			//console.log("list tactics response", rsp);
			if (rsp.status === 200) {
				return rsp.json()
			}
			return [];
		})
		.catch(error => console.error(error));
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
			//console.log("saving tactics response", rsp);
			return rsp.status;
		})
		.catch(error => console.error(error));
	}

	async Load(tacticsID) {
		//console.log("Loading tactics");
		const l = document.location;
		let url = l.protocol + '//' + l.host + this.loadURL + "?t=" + tacticsID;

		const tactics = await fetch(url, {
			mode:"same-origin",
			cache:"no-cache",
			redirect:"error"
		})
		.then(rsp => {
			//console.log("Loading tactics response", rsp);
			if (rsp.status === 200) {
				return rsp.json()
			}
			return null;
		})
		.catch(error => console.error(error));
		return tactics;
	}

	async LoadShared(tacticsID) {
		//console.log("Loading shared tactics");
		const l = document.location;
		let url = l.protocol + '//' + l.host + this.loadSharedURL + "?t=" + tacticsID;

		const tactics = await fetch(url, {
			mode:"same-origin",
			cache:"no-cache",
			redirect:"error"
		})
		.then(rsp => {
			//console.log("Loading shared tactics response", rsp);
			if (rsp.status === 200) {
				return rsp.json()
			}
			return null;
		})
		.catch(error => console.error(error));
		return tactics;
	}

	async Delete(tacticsID) {
		//console.log("deleting tactics");
		const l = document.location;
		let url = l.protocol + '//' + l.host + this.deleteURL + "?t=" + tacticsID;

		await fetch(url, {
			method: "POST",
			mode:"same-origin",
			cache:"no-cache",
			redirect:"error"
		})
		.then(rsp => {
			console.log("Deleting tactics response", rsp);
		})
		.catch(error => console.error(error));
	}
}

export default CoatchingfutsalServer;