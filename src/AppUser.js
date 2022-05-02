class AppUser {
	constructor(displayName="", photoURL=""){
		this._displayName = displayName;
		this._photoURL = photoURL;
	}

	get displayName() {
		return this._displayName;
	}

	get photoURL() {
		return this._photoURL;
	}
}

export default AppUser;