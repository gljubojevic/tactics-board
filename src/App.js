import React from 'react';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import PitchEdit from './editors/PitchEdit'
import SvgToImg from './editors/SvgToImg'
import AppTools from './ui/AppTools'
import './App.css';

// application Material-UI theme
const appTheme = createMuiTheme();

const refPitchEdit = React.createRef();
const refSvgToImg = React.createRef();

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
				<AppTools pitchEditSaveImage={SaveImage} />
				<PitchEdit ref={refPitchEdit} noPlayers={200} noBalls={100} viewBoxLeft={0} viewBoxTop={0} viewBoxRight={4500} viewBoxBottom={2500} />
				<SvgToImg ref={refSvgToImg} />
			</ThemeProvider>
		</React.Fragment>
	);
}

export default App;
