const AppConfigs = {
	default: {
		useFirebase: true,
		siteLogoURL: null,
		pitchCenterADURL: null,
	},
	coatchingfutsal: {
		useFirebase: false,
		siteLogoURL: '/tactics-board/ext/cf_logo.png',
		pitchCenterADURL: '/tactics-board/ext/heineken-logo.png',
		signInURL: '/login',
		signOutURL: '/logout',
		getUserURL: '/get-user',
		saveURL: '/tactics-save',
		loadURL: '/tactics-load',
		loadSharedURL: '/tactics-load-shared',
		listURL: '/tactics-list',
		deleteURL: '/tactics-delete'
	}
}

export default AppConfigs;