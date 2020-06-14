import React from 'react';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import PitchEdit from './editors/PitchEdit'
import AppTools from './ui/AppTools'
import './App.css';

// application Material-UI theme
const appTheme = createMuiTheme();

function App() {
	return (
		<React.Fragment>
			<ThemeProvider theme={appTheme}>
				<AppTools />
				<PitchEdit noPlayers={200} noBalls={100} viewBoxLeft={0} viewBoxTop={0} viewBoxRight={4500} viewBoxBottom={2500} />
			</ThemeProvider>
		</React.Fragment>
	);
}

export default App;
