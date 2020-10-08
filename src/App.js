import React, { Component } from 'react';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import PitchEdit from './editors/PitchEdit'
import SvgToImg from './editors/SvgToImg'
import AppTools from './ui/AppTools'
import PitchFutsal from './pitch/PitchFutsal'
import './App.css';

class App extends Component {
	constructor(props) {
		super(props);
		// application Material-UI theme
		this.appTheme = createMuiTheme();
		// references for saving images
		this.refPitchEdit = React.createRef();
		this.refSvgToImg = React.createRef();
		// initial state
		this.state = {
			pitchFutsal: this.DefaultPitch()
		};
		// event handlers
		this.SaveImage = this.SaveImage.bind(this);
		this.CreateNewScheme = this.CreateNewScheme.bind(this);
		this.CreateNewAnimation = this.CreateNewAnimation.bind(this);
	}
	
	DefaultPitch() {
		return new PitchFutsal(
			200, 8, 120, 
			100, 5, 80
		);
	}

	CreateNewScheme() {
		console.log("Create new scheme");
		this.setState({
			pitchFutsal: this.DefaultPitch()
		});
	}

	CreateNewAnimation() {
		console.log("Create new animation");
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
		const pitchFutsal = this.state.pitchFutsal;
		return (
			<React.Fragment>
				<ThemeProvider theme={this.appTheme}>
					<AppTools pitchFutsal={pitchFutsal} pitchEditSaveImage={this.SaveImage} createNewScheme={this.CreateNewScheme} createNewAnimation={this.CreateNewAnimation} />
					<PitchEdit ref={this.refPitchEdit} pitch={pitchFutsal} viewBoxLeft={0} viewBoxTop={0} viewBoxRight={4500} viewBoxBottom={2500} />
					<SvgToImg ref={this.refSvgToImg} />
				</ThemeProvider>
			</React.Fragment>
		);
	}
}

export default App;
