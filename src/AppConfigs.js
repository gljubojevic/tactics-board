const AppConfigs = {
	default: {
		useFirebase: true,
		siteLogoURL: null,
		pitchCenterADURL: null,
	},
	coatchingfutsal: {
		useFirebase: false,
		siteLogoURL: '/TacticsBoard/ext/cf_logo.png',
		pitchCenterADURL: '/TacticsBoard/ext/heineken-logo.png',
		signInURL: '/Account/LoginRegister',
		signOutURL: '/Account/LogOff',
		getUserURL: '/Account/GetUser',
		saveURL: '/TacticsBoard/SaveTactic',
		loadURL: '/TacticsBoard/TacticsLoad',
		loadSharedURL: '/TacticsBoard/TacticsLoadShared',
		listURL: '/TacticsBoard/GetTacticsList',
		deleteURL: '/TacticsBoard/DeleteTactic'
	}
}

export default AppConfigs;