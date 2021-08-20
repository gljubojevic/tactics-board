import React, { Component } from 'react';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import PitchEdit from './editors/PitchEdit'
import SvgToImg from './editors/SvgToImg'
import AppTools from './ui/AppTools'
import AnimPlayer from './ui/AnimPlayer'
import ConfirmDialog from './ui/ConfirmDialog'
import PitchFutsal from './pitch/PitchFutsal'
import DrawMode from './pitch/DrawMode'
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import './App.css';

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
		// event handlers
		this.SaveImage = this.SaveImage.bind(this);
		this.CreateNewScheme = this.CreateNewScheme.bind(this);
		this.CreateNewAnimation = this.CreateNewAnimation.bind(this);
		this.PitchReset = this.PitchReset.bind(this);
		this.OnPitchModified = this.OnPitchModified.bind(this);
		this.OnDrawModeModified = this.OnDrawModeModified.bind(this);
		this.SnackbarOpen=this.SnackbarOpen.bind(this);
		this.SnackbarOnClose=this.SnackbarOnClose.bind(this);
		this.AnimKeyFrameAdd=this.AnimKeyFrameAdd.bind(this);
		this.AnimKeyFrameNext=this.AnimKeyFrameNext.bind(this);
		this.AnimKeyFramePrevious=this.AnimKeyFramePrevious.bind(this);
		this.AnimKeyFrameDurationSet=this.AnimKeyFrameDurationSet.bind(this);
		this.animPlayerAnchorEl=this.animPlayerAnchorEl.bind(this);
		this.animPlayerShow=this.animPlayerShow.bind(this);

		// init default state
		this.pitch = this.DefaultPitch();
		this.pitch.onModified = this.OnPitchModified;
		this.drawMode = new DrawMode();
		this.drawMode.onModified = this.OnDrawModeModified;
		this.state = {
			pitch: this.pitch,
			drawMode: this.drawMode,
			snackBar: {
				Show: false,
				Severity: 'info',
				Message: ''
			}
		}
	}
	
	DefaultPitch() {
		let pitch = new PitchFutsal();
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

	CreateNewScheme() {
		if (!this.state.pitch.isModified) {
			return;
		}
		this.refConfirmDialog.current.Show(
			"Create new scheme", "Pitch is modified, are you sure you want to discard changes?",
			this.PitchReset
		);
	}

	CreateNewAnimation() {
		this.refConfirmDialog.current.Show(
			"Create new animation", "Are you sure you want to create new animation?",
			null
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

	AnimKeyFrameAdd() {
		if (this.pitch.animKeyFrameAdd()){
			this.SnackbarOpen("success", "New key frame added to animation");
		} else {
			this.SnackbarOpen("error", "Can't add new key frame no change is done to current key frame");
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

	animPlayerAnchorEl() {
		return this.refPitchEdit.current;
	}

	animPlayerShow() {
		this.refAnimPlayer.current.show();
    }

	render() {
		return (
			<React.Fragment>
				<ThemeProvider theme={this.appTheme}>
					<AppTools drawMode={this.state.drawMode}
						saveImage={this.SaveImage}
						createNewScheme={this.CreateNewScheme}
						createNewAnimation={this.CreateNewAnimation}
						animKeyFrameCurrent={this.state.pitch.AnimKeyFrameCurrent}
						animKeyFrameAdd={this.AnimKeyFrameAdd}
						animKeyFrameNext={this.AnimKeyFrameNext}
						animKeyFramePrevious={this.AnimKeyFramePrevious}
						animKeyFrameDurationSet={this.AnimKeyFrameDurationSet}
						animPlayerShow={this.animPlayerShow}
					/>
					<PitchEdit ref={this.refPitchEdit} pitch={this.state.pitch} drawMode={this.state.drawMode} viewBoxLeft={0} viewBoxTop={0} viewBoxRight={4500} viewBoxBottom={2500} />
					<AnimPlayer ref={this.refAnimPlayer} anchorEl={this.animPlayerAnchorEl} />
					<ConfirmDialog ref={this.refConfirmDialog} />
					<Snackbar open={this.state.snackBar.Show} anchorOrigin={{ vertical: 'bottom', horizontal: 'center'}} autoHideDuration={2000} onClose={this.SnackbarOnClose}>
						<MuiAlert elevation={6} variant="filled" onClose={this.SnackbarOnClose} severity={this.state.snackBar.Severity}>{this.state.snackBar.Message}</MuiAlert>
					</Snackbar>
					<SvgToImg ref={this.refSvgToImg} />
				</ThemeProvider>
			</React.Fragment>
		);
	}
}

export default App;
