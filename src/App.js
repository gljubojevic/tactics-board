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
import { v4 as uuidv4 } from 'uuid';
// Import the functions you need from the SDKs you need
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
// TODO: Add SDKs for Firebase products that you want to use
import { getFirestore } from "firebase/firestore";
import { collectionGroup, query, where, getDocs, doc as fsDoc, setDoc as fsSetDoc, getDoc as fsGetDoc, Timestamp as fsTimestamp } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { ref as refFile, uploadBytes } from "firebase/storage";
// https://firebase.google.com/docs/web/setup#available-libraries
// For auth using: https://github.com/firebase/firebaseui-web-react
import './App.css';
import './firebaseui-styling.global.css';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: "AIzaSyDAb0oHSQCeihL0Op9agehWqYQh1-7E4xE",
	authDomain: "tactics-board-1c644.firebaseapp.com",
	projectId: "tactics-board-1c644",
	storageBucket: "tactics-board-1c644.appspot.com",
	messagingSenderId: "704589627362",
	appId: "1:704589627362:web:b110cc834a5f5c19c543bb",
	measurementId: "G-PDXB2VPRL8"
};

// Initialize Firebase
const firebaseApp = firebase.initializeApp(firebaseConfig);
//const analytics = getAnalytics(firebaseApp);
const firestoreDB = getFirestore();
const storage = getStorage();


class App extends Component {
	constructor(props) {
		super(props);
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
		this.animPlayerAnchorEl=this.animPlayerAnchorEl.bind(this);
		this.animPlayerShow=this.animPlayerShow.bind(this);
		this.LocalStorageLoad = this.LocalStorageLoad.bind(this);
		this.LocalStorageSave = this.LocalStorageSave.bind(this);
		this.LocalStorageDelete = this.LocalStorageDelete.bind(this);
		this.ColorPaletteEdit = this.ColorPaletteEdit.bind(this);
		this.showSaveDialog = this.showSaveDialog.bind(this);
		this.firebaseSave = this.firebaseSave.bind(this);
		this.firebaseBrowse = this.firebaseBrowse.bind(this);
		this.firebaseLoad =this.firebaseLoad.bind(this);

		// init default state
		this.pitch = this.DefaultPitch();
		this.pitch.onModified = this.OnPitchModified;
		this.drawMode = new DrawMode();
		this.drawMode.onModified = this.OnDrawModeModified;
		this.state = {
			isSignedIn: false,
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
		this.unregisterAuthObserver = firebaseApp.auth().onAuthStateChanged((user) => {
			console.log("Current user",user);
			this.setState({
				isSignedIn: !!user
			});
		});
		// load previous board editing
		this.LocalStorageLoad();
	}

	componentWillUnmount() {
		this.unregisterAuthObserver();
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

	async firebaseSave(name, description) {
		console.log("Firebase save", name, description);
		this.state.pitch.setNameAndDescription(name, description);
		// save to local storage to keep it and get data for save
		const data = this.LocalStorageSave();
		//console.log(data);
		
		// save to google firestore
		if (!this.state.isSignedIn) {
			console.error("User is not signed in");
			return
		}

		const user = firebaseApp.auth().currentUser;
		if (!user) {
			console.error("User is not signed in");
			return
		}
		//console.log(user);

		// first create/update user collection
		const tacticsCollection = "user-tactics";
		try {
			const userCollection = { name: user.displayName };
			const userDocRef = await fsSetDoc(
				fsDoc(firestoreDB, tacticsCollection, user.uid), 
				userCollection, 
				{merge:true}
			);
			console.log(userDocRef);
		} catch (error) {
			console.error("Creating / updating user collection", error);
		}

		// user tactics root path for documents and thumbs
		const userTacticsRoot = tacticsCollection + "/" + user.uid;

		// 2nd store thumbnail
		try {
			const svg = this.refPitchEdit.current.getSVG();
			const tmbWidth = 320;
			const tmbHeight = tmbWidth * svg.height / svg.width;
			const blob = await this.refSvgToImg.current.toBlob(
				svg.svgText,
				svg.width, svg.height,
				tmbWidth, tmbHeight
			);
			const userTacticsThumbs = userTacticsRoot + "/tactics-thumbs/" + data.id + ".png";
			const thumbRef = refFile(storage, userTacticsThumbs);
			uploadBytes(thumbRef, blob).then((snapshot) => {
				console.log('Uploaded a blob or file!', snapshot);
			});
		} catch (error) {
			console.error("Saving tactics board thumbnail", error);
		}

		// 3rd store tactics document
		try {
			// convert dates to firestore timestamps
			data.created = fsTimestamp.fromDate(data.created);
			data.updated = fsTimestamp.fromDate(data.updated);
			// save
			const userTacticsCollection = userTacticsRoot + "/tactics";
			const tacticsDocRef = await fsSetDoc(
				fsDoc(firestoreDB, userTacticsCollection, data.id), 
				data
			);
			console.log(tacticsDocRef);
		} catch (error) {
			console.error("Saving tactics board", error);
		}
	}

	firebaseBrowse() {
		this.refLoadDialog.current.Show();
	}

	editTactics(tactics, toLocalStorage) {
		if (null === tactics) {
			return;
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

	async firebaseLoadShared(tacticsID) {
		console.log("Loading shared tactics", tacticsID);

		let tactics = null;
		try {
			// requires index on collection:tactics and field:id
			const tacticsQuery = query(collectionGroup(firestoreDB, 'tactics'), where('id', '==', tacticsID));
			const querySnapshot = await getDocs(tacticsQuery);
			querySnapshot.forEach((doc) => {
				//console.log(doc.id, ' => ', doc.data());
				tactics = doc.data();
				// fix data
				tactics.created = new fsTimestamp(
					tactics.created.seconds, 
					tactics.created.nanoseconds
				).toDate();
				tactics.updated = new fsTimestamp(
					tactics.updated.seconds, 
					tactics.updated.nanoseconds
				).toDate()
				// change ID so user can save it as own tactics
				tactics.id = uuidv4();
			});
		} catch (error) {
			console.error("Loading shared tactics", error);
		}

		this.editTactics(tactics, true);
	}

	async firebaseLoad(tacticsID) {
		console.log("Loading user tactics", tacticsID);

		const user = firebaseApp.auth().currentUser;
		if (!user) {
			console.error("User is not signed in");
			return
		}

		let tactics = null;

		try {
			const userTacticsPath = "user-tactics/" + user.uid + "/tactics/" + tacticsID;
			const tacticsRef = fsDoc(firestoreDB, userTacticsPath);
			const res = await fsGetDoc(tacticsRef);

			if (!res.exists()) {
				console.log("User tactics not found", tacticsID);
				return;
			}

			tactics = res.data();
			tactics.created = new fsTimestamp(
				tactics.created.seconds, 
				tactics.created.nanoseconds
			).toDate();
			tactics.updated = new fsTimestamp(
				tactics.updated.seconds, 
				tactics.updated.nanoseconds
			).toDate()
			console.log(res.id, " => ", tactics);
		} catch (error) {
			console.error("Loading user tactics", error);
			return;
		}

		this.editTactics(tactics, true);
	}

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
		console.log(tactics.id, " => ", tactics);
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
						isSignedIn={this.state.isSignedIn}
						firebaseApp={firebaseApp}
						toggleDrawer={this.ToggleDrawer}
					/>
					<DrawerMenu ref={this.refDrawerMenu}
						load={this.firebaseBrowse}
						save={this.showSaveDialog} 
						saveImage={this.SaveImage} 
						newScheme={this.NewScheme}
						newAnimation={this.NewAnimation}
						deleteAnimation={this.DeleteAnimation}
						colorPaletteEdit={this.ColorPaletteEdit}
						animExists={this.state.pitch.AnimExists}
						isSignedIn={this.state.isSignedIn}
					/>
					<PitchEdit ref={this.refPitchEdit} pitch={this.state.pitch} drawMode={this.state.drawMode} viewBoxLeft={0} viewBoxTop={0} viewBoxRight={4500} viewBoxBottom={2500} />
					<AnimPlayer ref={this.refAnimPlayer} 
						anchorEl={this.animPlayerAnchorEl}
						keyFramesNo={this.state.pitch.AnimKeyFrames.length}
						keyFrameDuration={this.state.pitch.AnimKeyFrameDuration}
						animStart={this.AnimStart}
						animStop={this.AnimStop}
						animFrame={this.AnimFrame}
					/>
					<ConfirmDialog ref={this.refConfirmDialog} />
					<PaletteEditorDialog ref={this.refPaletteEditorDialog} drawMode={this.state.drawMode} />
					<SaveDialog ref={this.refSaveDialog} onSave={this.firebaseSave} />
					<BrowseDialog ref={this.refLoadDialog} onLoad={this.firebaseLoad} firebaseApp={firebaseApp} firestoreDB={firestoreDB} storage={storage} />
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
