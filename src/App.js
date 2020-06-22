import React from 'react';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import PitchEdit from './editors/PitchEdit'
import SvgToImg from './editors/SvgToImg'
import AppTools from './ui/AppTools'
import PitchFutsal from './pitch/PitchFutsal'
import './App.css';

// application Material-UI theme
const appTheme = createMuiTheme();

const refPitchEdit = React.createRef();
const refSvgToImg = React.createRef();

// init default pitch
const pitchFutsal = new PitchFutsal(
	200, 8, 120, 
	100, 5, 80
);

function SaveImage() {
	console.log("App save image");
	let svg = refPitchEdit.current.getSVG();
	refSvgToImg.current.toImg(
		svg.svgText, 
		svg.width, svg.height, 
		svg.width/2, svg.height/2
	);
}

function App() {
	return (
		<React.Fragment>
			<ThemeProvider theme={appTheme}>
				<AppTools pitchFutsal={pitchFutsal} pitchEditSaveImage={SaveImage} />
				<PitchEdit ref={refPitchEdit} pitch={pitchFutsal} viewBoxLeft={0} viewBoxTop={0} viewBoxRight={4500} viewBoxBottom={2500} />
				<SvgToImg ref={refSvgToImg} />
			</ThemeProvider>
		</React.Fragment>
	);
}

export default App;
