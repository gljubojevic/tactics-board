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
		if (!goToURL.startsWith('/')) {
			goToURL = '/' + goToURL;
		}
		let returnURL = l.href;
		let url = l.protocol + '//' + l.host + goToURL + '?rurl=' + encodeURIComponent(returnURL) 
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

	}

	UserChangesSubscribe() {

	}

	UserChangesUnsubscribe() {
	}

	async List(tacticsPerPage, afterDoc) {
		let tacticsList = [];
		return tacticsList;
	}

	async Save(tactics, thumbnailBlob) {
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