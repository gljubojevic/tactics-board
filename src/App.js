import React, { Component } from 'react';
import { createTheme, ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import PitchEdit from './editors/PitchEdit';
import SvgToImg from './editors/SvgToImg';
import AppTools from './ui/AppTools';
import AnimPlayer from './ui/AnimPlayer';
import ConfirmDialog from './ui/ConfirmDialog';
import PaletteEditorDialog from './ui/PaletteEditorDialog';
import PitchFutsal from './pitch/PitchFutsal';
import DrawerMenu from './ui/DrawerMenu';
import DrawMode from './pitch/DrawMode';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import SaveDialog from './ui/SaveDialog';
import BrowseDialog from './ui/BrowseDialog';
import ShareDialog from './ui/ShareDialog';
import { v4 as uuidv4 } from 'uuid';
import FirebaseServer from './firebaseSDK';
import CoatchingfutsalServer from './coatchingfutsalSDK';
import './App.css';
import './firebaseui-styling.global.css';
import AppConfigs from './AppConfigs';
import SiteLogo from './ui/SiteLogo';
import HelpDialog from './ui/HelpDialog';
import SignInDialog from './ui/SignInDialog';

class App extends Component {
	constructor(props) {
		super(props);
		//this.config = AppConfigs.default;
		this.config = AppConfigs.coatchingfutsal;
		// application Material-UI theme
		this.appTheme = createTheme();
		// references
		this.refPitchEdit = React.createRef();
		this.refSvgToImg = React.createRef();
		this.refConfirmDialog = React.createRef();
		this.refAnimPlayer = React.createRef();
		this.refDrawerMenu = React.createRef();
		this.refPaletteEditorDialog = React.createRef();
		this.refSaveDialog = React.createRef();
		this.refLoadDialog = React.createRef();
		this.refShareDialog = React.createRef();
		this.refHelpDialog = React.createRef();
		this.refSignInDialog = React.createRef();
		// event handlers
		this.ToggleDrawer = this.ToggleDrawer.bind(this);
		this.SaveImage = this.SaveImage.bind(this);
		this.NewScheme = this.NewScheme.bind(this);
		this.NewAnimation = this.NewAnimation.bind(this);
		this.AnimCreate = this.AnimCreate.bind(this);
		this.DeleteAnimation = this.DeleteAnimation.bind(this);
		this.AnimDelete = this.AnimDelete.bind(this);
		this.PitchReset = this.PitchReset.bind(this);
		this.ExtrasCreate = this.ExtrasCreate.bind(this);
		this.OnPitchModified = this.OnPitchModified.bind(this);
		this.OnDrawModeModified = this.OnDrawModeModified.bind(this);
		this.SnackbarOpen=this.SnackbarOpen.bind(this);
		this.SnackbarOnClose=this.SnackbarOnClose.bind(this);
		this.AnimKeyFrameAdd=this.AnimKeyFrameAdd.bind(this);
		this.AnimKeyFrameDelete=this.AnimKeyFrameDelete.bind(this);
		this.AnimKeyFrameNext=this.AnimKeyFrameNext.bind(this);
		this.AnimKeyFramePrevious=this.AnimKeyFramePrevious.bind(this);
		this.AnimKeyFrameDurationSet=this.AnimKeyFrameDurationSet.bind(this);
		this.AnimStart=this.AnimStart.bind(this);
		this.AnimStop=this.AnimStop.bind(this);
		this.AnimFrame=this.AnimFrame.bind(this);
		this.AnimShowPaths=this.AnimShowPaths.bind(this);
		this.animPlayerAnchorEl=this.animPlayerAnchorEl.bind(this);
		this.animPlayerShow=this.animPlayerShow.bind(this);
		this.LocalStorageLoad = this.LocalStorageLoad.bind(this);
		this.LocalStorageSave = this.LocalStorageSave.bind(this);
		this.LocalStorageDelete = this.LocalStorageDelete.bind(this);
		this.ColorPaletteEdit = this.ColorPaletteEdit.bind(this);
		this.showSaveDialog = this.showSaveDialog.bind(this);
		this.showSaveAsDialog = this.showSaveAsDialog.bind(this);
		this.TacticsList = this.TacticsList.bind(this);
		this.TacticsDelete = this.TacticsDelete.bind(this);
		this.TacticsSave = this.TacticsSave.bind(this);
		this.TacticsBrowse = this.TacticsBrowse.bind(this);
		this.TacticsLoad = this.TacticsLoad.bind(this);
		this.TacticsLoadShared = this.TacticsLoadShared.bind(this);
		this.ShowHelp = this.ShowHelp.bind(this);
		this.ShareTactics = this.ShareTactics.bind(this);
		this.signIn = this.signIn.bind(this);
		this.signOut = this.signOut.bind(this);
		this.signedInCallback = this.signedInCallback.bind(this);
		this.goSiteHome = this.goSiteHome.bind(this);

		if (this.config.useFirebase) {
			this.server = new FirebaseServer(
				this.config.siteHomeURL,
				this.signedInCallback
			);
		} else {
			this.server = new CoatchingfutsalServer(
				this.config.siteHomeURL,
				this.config.signInURL,
				this.config.signOutURL,
				this.config.getUserURL,
				this.signedInCallback,
				this.config.saveURL,
				this.config.loadURL,
				this.config.loadSharedURL,
				this.config.listURL,
				this.config.deleteURL,
			);
		}

		// init default state
		this.pitch = this.DefaultPitch();
		this.pitch.onModified = this.OnPitchModified;
		this.drawMode = new DrawMode();
		this.drawMode.onModified = this.OnDrawModeModified;
		this.state = {
			currentUser: null,
			pitch: this.pitch,
			drawMode: this.drawMode,
			snackBar: {
				Show: false,
				Severity: 'info',
				Message: ''
			}
		}
	}

	componentDidMount() {
		// mount handler for authentication
		this.server.UserChangesSubscribe();
		// load previous board editing
		this.LocalStorageLoad();
	}

	componentWillUnmount() {
		// unmount handler for authentication
		this.server.UserChangesUnsubscribe();
	}

	signedInCallback(currentUser) {
		this.setState({
			currentUser: currentUser
		});
		// load when param is present
		if (this.LoadUsingUrlParam()) {
			return;
		}
	}

	DefaultPitch() {
		const id = uuidv4();
		const pitch = new PitchFutsal(id);
		pitch.initDefault(
			200, 8, 120, 
			100, 5, 80
		);
		return pitch;
	}

	PitchReset() {
		console.log("Pitch reset");
		this.pitch.onModified = null;
		this.pitch = this.DefaultPitch();
		this.pitch.onModified = this.OnPitchModified;
		this.drawMode.onModified = null;
		this.drawMode = new DrawMode();
		this.drawMode.onModified = this.OnDrawModeModified;
		this.setState({
			pitch: this.pitch,
			drawMode: this.drawMode
		});
		this.LocalStorageDelete();
	}

	OnPitchModified(newPitch) {
		this.pitch.onModified = null;
		this.pitch = newPitch;
		this.pitch.onModified = this.OnPitchModified;
		this.setState({
			pitch: this.pitch
		});
	}

	OnDrawModeModified(newDrawMode) {
		this.drawMode.onModified = null;
		this.drawMode = newDrawMode;
		this.drawMode.onModified = this.OnDrawModeModified;
		this.setState({
			drawMode: this.drawMode
		});
		// update pitch overlay
		// TODO: reconsider this
		this.pitch.overlay = this.drawMode.pitchOverlay;
	}

	ToggleDrawer(e) {
		this.refDrawerMenu.current.ToggleDrawer(e);
	}

	NewScheme() {
		if (!this.state.pitch.isModified) {
			return;
		}
		this.refConfirmDialog.current.Show(
			"Create new scheme", "Pitch is modified, are you sure you want to discard changes?",
			this.PitchReset
		);
	}

	NewAnimation() {
		this.refConfirmDialog.current.Show(
			"Create new animation", "Are you sure you want to create new animation?",
			this.AnimCreate
		);
	}

	DeleteAnimation() {
		this.refConfirmDialog.current.Show(
			"Delete animation", "Are you sure you want to delete animation, only first key frame will be kept?",
			this.AnimDelete
		);
	}

	SaveImage() {
		console.log("App save image");
		let svg = this.refPitchEdit.current.getSVG();
		this.refSvgToImg.current.toImg(
			svg.svgText, 
			svg.width, svg.height, 
			svg.width/2, svg.height/2
		);
	}

	ColorPaletteEdit() {
		this.refPaletteEditorDialog.current.Show();
	}

	showSaveDialog() {
		this.refSaveDialog.current.Show(
			this.state.pitch.name,
			this.state.pitch.description
		);
	}

	showSaveAsDialog() {
		this.refSaveDialog.current.Show(
			this.state.pitch.name,
			this.state.pitch.description,
			true
		);
	}

	///////////////////////////////////
	// url loading or loading shared

	async LoadUsingUrlParam() {
		let l = document.location;
		let params = new URLSearchParams(document.location.search);
		let t = params.get("t");
		if (null !== t) {
			await this.TacticsLoad(t);
			// when loaded redirect without param
			document.location = l.protocol + '//' + l.host + l.pathname;
			return true;
		}
		let ts = params.get("ts");
		if (null !== ts) {
			await this.TacticsLoadShared(ts);
			// when loaded redirect without param
			document.location = l.protocol + '//' + l.host + l.pathname;
			return true;
		}
		return false;
	}

	///////////////////////////////////
	// Site home

	goSiteHome() {
		this.server.goHomeURL();
	}

	///////////////////////////////////
	// User management

	signIn() {
		if (this.config.useFirebase) {
			this.refSignInDialog.current.Show();		
		} else {
			this.server.SignIn();
		}
	}

	async signOut() {
		await this.server.SignOut();
	}

	get isSignedIn() {
		return null !== this.state.currentUser;
	}

	///////////////////////////////////
	// Server related functions

	async TacticsList(tacticsPerPage, afterDoc, dateFrom, dateTo, searchText) {
		return await this.server.List(tacticsPerPage, afterDoc, dateFrom, dateTo, searchText);
	}

	async TacticsDelete(tacticsID) {
		await this.server.Delete(tacticsID) 
	}

	async TacticsSave(name, description, saveAs) {
		if (!this.isSignedIn) {
			console.error("User is not signed in");
			return
		}

		// save to local storage to keep it and get data for save
		if (saveAs) {
			this.state.pitch.id = uuidv4();
		}
		this.state.pitch.setNameAndDescription(name, description);
		const tactics = this.LocalStorageSave();

		// create thumbnail
		const svg = this.refPitchEdit.current.getSVG();
		const tmbWidth = this.config.thumbnailWidth;
		const tmbHeight = tmbWidth * svg.height / svg.width;
		const thumbnailBlob = await this.refSvgToImg.current.toBlob(
			svg.svgText,
			svg.width, svg.height,
			tmbWidth, tmbHeight
		);

		this.server.Save(tactics, thumbnailBlob);
	}

	TacticsBrowse() {
		if (!this.isSignedIn) {
			console.error("User is not signed in");
			return
		}
		this.refLoadDialog.current.Show();
	}

	async TacticsLoad(tacticsID) {
		if (!this.isSignedIn) {
			console.error("User is not signed in");
			return
		}
		let tactics = await this.server.Load(tacticsID);
		this.editTactics(tactics, true, false);
	}

	async TacticsLoadShared(tacticsID) {
		if (!this.isSignedIn) {
			console.error("User is not signed in");
			return
		}
		let tactics = await this.server.LoadShared(tacticsID); 
		// change ID so user can save it as own tactics
		this.editTactics(tactics, true, true);
	}

	editTactics(tactics, toLocalStorage, changeID) {
		if (null === tactics) {
			return;
		}
		if (changeID) {
			tactics.id = uuidv4();
		}
		this.state.pitch.load(tactics);
		// check for settings and update settings
		if (tactics.settings) {
			this.state.drawMode.updateColors(
				tactics.settings.objectColors,
				tactics.settings.playerColors,
				tactics.settings.ballColors
			);
		}
		if (toLocalStorage) {
			this.LocalStorageSave();
		}
	}

	///////////////////////////////////
	// LocalStorage related functions

	LocalStorageSave() {
		console.log("Saving to localStorage.");
		let tactics = this.state.pitch.save();
		// append settings to save object
		tactics.settings = {
			objectColors: this.state.drawMode.colorOptions,
			playerColors: this.state.drawMode.colorOptionsPlayer,
			ballColors: this.state.drawMode.colorOptionsBall,
		}
		localStorage.setItem("tactics-board-current", JSON.stringify(tactics));
		return tactics;
	}

	LocalStorageLoad() {
		let json = localStorage.getItem("tactics-board-current");
		if (null === json) {
			return;
		}
		console.log("Loading from localStorage.");
		const tactics = JSON.parse(json);
		//console.log(tactics.id, " => ", tactics);
		this.state.pitch.load(tactics);
		// check for settings and update settings
		if (tactics.settings) {
			this.state.drawMode.updateColors(
				tactics.settings.objectColors,
				tactics.settings.playerColors,
				tactics.settings.ballColors
			);
		}
	}

	LocalStorageDelete() {
		console.log("Deleting from localStorage.");
		localStorage.removeItem("tactics-board-current");
	}

	// function to open Snackbar
	SnackbarOpen(severity, message) {
		this.setState({
			snackBar: {
				Show: true,
				Severity: severity,
				Message: message
			}
		});
	}

	// Event when Snackbar closes
	SnackbarOnClose(){
		// read current state to avoid changing message while hiding
		const severity = this.state.snackBar.Severity;
		const message = this.state.snackBar.Message;
		// hide snackbar
		this.setState({
			snackBar: {
				Show: false,
				Severity: severity,
				Message: message
			}
		});
	}

	ExtrasCreate(t, width, height) {
		this.pitch.extrasCreate(
			t, this.state.drawMode.color, 
			width, height
		);
	}

	///////////////////////////////////
	// Anim related functions

	AnimCreate() {
		this.pitch.animCreate();
	}

	AnimDelete() {
		this.pitch.animDelete();
	}

	AnimKeyFrameAdd() {
		if (this.pitch.animKeyFrameAdd()){
			this.SnackbarOpen("success", "New key frame added to animation");
		} else {
			this.SnackbarOpen("error", "Can't add new key frame no change is done to current key frame");
		}
	}

	AnimKeyFrameDelete() {
		if (this.pitch.animKeyFrameDelete()) {
			this.SnackbarOpen("success", "Key frame deleted from animation");
 		} else {
			this.SnackbarOpen("error", "Can't delete key frame, only last can be deleted.");
		}
	}

	AnimKeyFrameNext() {
		if (!this.pitch.animKeyFrameNext()) {
			this.SnackbarOpen("warning", "No more key frames to navigate");
		}
	}

	AnimKeyFramePrevious() {
		if (!this.pitch.animKeyFramePrevious()) {
			this.SnackbarOpen("warning", "You are on first key frame");
		}
	}

	AnimKeyFrameDurationSet(duration){
		if (!this.pitch.animKeyFrameDurationSet(duration)) {
			this.SnackbarOpen("info", `You set the frame duration to ${duration}s` );
		}
	}

	AnimStart() {
		this.state.pitch.animStart();
	}

	AnimStop() {
		this.state.pitch.animStop();
	}

	AnimFrame(time) {
		this.state.pitch.animFrame(time);
	}

	AnimShowPaths(show) {
		this.state.pitch.animShowPaths(show);
	}

	animPlayerAnchorEl() {
		return this.refPitchEdit.current;
	}

	animPlayerShow() {
		if (this.state.pitch.AnimKeyFrames.length < 2) {
			this.SnackbarOpen("warning", "No animation is created");
			return;
		}
		this.refAnimPlayer.current.show();
    }

	ShowHelp() {
		this.refHelpDialog.current.Show();
	}

	ShareTactics() {
		this.refShareDialog.current.Show(
			this.state.pitch.id,
			this.state.pitch.name,
			this.state.pitch.description
		);
	}

	renderSignIn() {
		if (this.config.useFirebase) {
			return (
				<SignInDialog ref={this.refSignInDialog} firebaseApp={this.server.AppInstance} />
			);
		}
		return null;
	}

	render() {
		return (
			<StyledEngineProvider injectFirst>
				<ThemeProvider theme={this.appTheme}>
					<AppTools drawMode={this.state.drawMode}
						saveImage={this.SaveImage}
						animExists={this.state.pitch.AnimExists}
						animKeyFrameCurrent={this.state.pitch.AnimKeyFrameCurrent}
						animKeyFrameTotal={this.state.pitch.AnimKeyFrames.length}
						animKeyFrameAdd={this.AnimKeyFrameAdd}
						animKeyFrameDelete={this.AnimKeyFrameDelete}
						animKeyFrameNext={this.AnimKeyFrameNext}
						animKeyFramePrevious={this.AnimKeyFramePrevious}
						animKeyFrameDurationSet={this.AnimKeyFrameDurationSet}
						animPlayerShow={this.animPlayerShow}
						extrasCreate={this.ExtrasCreate}
						toggleDrawer={this.ToggleDrawer}
						shareTactics={this.ShareTactics}
						shareEnabled={this.state.pitch.shareEnabled()}
						showHelp={this.ShowHelp}
						currentUser={this.state.currentUser}
						signIn={this.signIn}
						signOut={this.signOut}
						siteHome={this.server.hasHomeURL() ? this.goSiteHome : null}
					/>
					<DrawerMenu ref={this.refDrawerMenu}
						load={this.TacticsBrowse}
						save={this.showSaveDialog}
						saveAs={this.showSaveAsDialog}
						saveImage={this.SaveImage} 
						newScheme={this.NewScheme}
						newAnimation={this.NewAnimation}
						deleteAnimation={this.DeleteAnimation}
						colorPaletteEdit={this.ColorPaletteEdit}
						animExists={this.state.pitch.AnimExists}
						isSignedIn={this.isSignedIn}
					/>
					<PitchEdit ref={this.refPitchEdit} pitch={this.state.pitch} drawMode={this.state.drawMode} centerADURL={this.config.pitchCenterADURL} />
					<SiteLogo logoURL={this.config.siteLogoURL} logoLink={this.config.siteHomeURL} />
					<AnimPlayer ref={this.refAnimPlayer} 
						anchorEl={this.animPlayerAnchorEl}
						keyFramesNo={this.state.pitch.AnimKeyFrames.length}
						keyFrameDuration={this.state.pitch.AnimKeyFrameDuration}
						pathsVisible={this.state.pitch.AnimShowPaths}
						animStart={this.AnimStart}
						animStop={this.AnimStop}
						animFrame={this.AnimFrame}
						animShowPaths={this.AnimShowPaths}
					/>
					{this.renderSignIn()}
					<ConfirmDialog ref={this.refConfirmDialog} />
					<PaletteEditorDialog ref={this.refPaletteEditorDialog} drawMode={this.state.drawMode} />
					<SaveDialog ref={this.refSaveDialog} onSave={this.TacticsSave} />
					<BrowseDialog ref={this.refLoadDialog} onList={this.TacticsList} onLoad={this.TacticsLoad} onDelete={this.TacticsDelete} />
					<ShareDialog ref={this.refShareDialog} />
					<HelpDialog ref={this.refHelpDialog} />
					<Snackbar open={this.state.snackBar.Show} anchorOrigin={{ vertical: 'bottom', horizontal: 'center'}} autoHideDuration={2000} onClose={this.SnackbarOnClose}>
						<MuiAlert elevation={6} variant="filled" onClose={this.SnackbarOnClose} severity={this.state.snackBar.Severity}>{this.state.snackBar.Message}</MuiAlert>
					</Snackbar>
					<SvgToImg ref={this.refSvgToImg} />
				</ThemeProvider>
			</StyledEngineProvider>
		);
	}
}

export default App;
