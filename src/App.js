import React, { Component } from 'react';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import PitchEdit from './editors/PitchEdit'
import SvgToImg from './editors/SvgToImg'
import AppTools from './ui/AppTools'
import ConfirmDialog from './ui/ConfirmDialog'
import PitchFutsal from './pitch/PitchFutsal'
import './App.css';

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			pitch: this.DefaultPitch()
		}
		// application Material-UI theme
		this.appTheme = createMuiTheme();
		// references
		this.refAppTools = React.createRef();
		this.refPitchEdit = React.createRef();
		this.refSvgToImg = React.createRef();
		this.refConfirmDialog = React.createRef();
		// event handlers
		this.SaveImage = this.SaveImage.bind(this);
		this.CreateNewScheme = this.CreateNewScheme.bind(this);
		this.CreateNewAnimation = this.CreateNewAnimation.bind(this);
		this.PitchReset = this.PitchReset.bind(this);
	}
	
	DefaultPitch() {
		return new PitchFutsal(
			200, 8, 120, 
			100, 5, 80
		);
	}

	PitchReset() {
		console.log("Pitch reset");
		this.setState({
			pitch: this.DefaultPitch()
		});
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

	render() {
		return (
			<React.Fragment>
				<ThemeProvider theme={this.appTheme}>
					<AppTools ref={this.refAppTools} pitch={this.state.pitch} pitchEditSaveImage={this.SaveImage} createNewScheme={this.CreateNewScheme} createNewAnimation={this.CreateNewAnimation} />
					<PitchEdit ref={this.refPitchEdit} pitch={this.state.pitch} viewBoxLeft={0} viewBoxTop={0} viewBoxRight={4500} viewBoxBottom={2500} />
					<ConfirmDialog ref={this.refConfirmDialog} />
					<SvgToImg ref={this.refSvgToImg} />
				</ThemeProvider>
			</React.Fragment>
		);
	}
}

export default App;
